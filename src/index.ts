import fs from "node:fs";
import type { Plugin } from "postcss";
import { glob } from "tinyglobby";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import cssGenerator from "./lib/css";
import scssGenerator from "./lib/scss";

export type Options = {
  /**
   * Whether to generate CSS typings.
   * @default true
   */
  css?: boolean;
  /**
   * Whether to generate SCSS typings.
   * @default false
   */
  scss?: boolean;
  /**
   * Additional PostCSS plugins to use when processing CSS files.
   *
   * Can be an array of plugins to be added, or a function that receives the default plugins
   * and returns a new array of plugins.
   * @default undefined
   */
  postcssPlugins?: Plugin[] | ((defaultPlugins: Plugin[]) => Plugin[]);
};

export const PLUGIN_NAME = "unplugin-typed-css-modules";

const defaultOptions: Options = {
  css: true,
  scss: false,
};

const PREFIX = `/* eslint-disable */
// WARNING: THIS FILE IS AUTO GENERATED, PLEASE DO NOT EDIT IT MANUALLY.
// prettier-ignore
`;

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options
) => {
  const opts = { ...defaultOptions, ...options };
  const fileExts = [
    ...(opts.css ? ["css"] : []),
    ...(opts.scss ? ["scss", "sass"] : []),
  ];
  const fileExtRegex = new RegExp(`\\.module\\.(${fileExts.join("|")})$`);
  const withBraces =
    fileExts.length === 1 ? fileExts[0] : `{${fileExts.join(",")}}`;
  const fileExtGlob = `**/*.module.${withBraces}`;

  const env = {
    isDev: process.env.NODE_ENV === "development",
    isRspack: false,
    forceBuild: /(true|TRUE)/.test(process.env.TCM_FORCE_BUILD ?? ""),
  };

  const css = cssGenerator({
    banner: PREFIX,
    plugins: opts.postcssPlugins,
  });
  const scss = scssGenerator({ banner: PREFIX });

  return {
    name: PLUGIN_NAME,
    rspack() {
      env.isRspack = true;
    },
    async watchChange(id, { event }) {
      if (!fileExtRegex.test(id)) return;
      if (event === "delete") {
        const dtsFile = id + ".d.ts";
        if (fs.existsSync(dtsFile)) {
          fs.unlinkSync(dtsFile);
        }
        return;
      }
      await (id.endsWith(".css") ? css.generate(id) : scss.generate(id));
    },
    async writeBundle() {
      if (env.isRspack && env.isDev) {
        // Rsbuild seems to call `writeBundle` even during dev mode, so we
        // check here to avoid failing the server start.
        // https://rsbuild.rs/config/mode#javascript-api
        return;
      }
      const dirname = process.cwd();
      const files = await glob(fileExtGlob, {
        cwd: dirname,
        absolute: true,
        ignore: ["node_modules"],
      });
      const results = await Promise.allSettled(
        // Fail the build if typings are out of date
        files.map((file) =>
          env.forceBuild
            ? file.endsWith(".css")
              ? css.generate(file)
              : scss.generate(file)
            : file.endsWith(".css")
              ? css.check(file)
              : scss.check(file)
        )
      );
      const rejected = results.filter((r) => r.status === "rejected");
      if (rejected.length) {
        console.error(
          `[unplugin-typed-css-modules] ${rejected.length} file(s) have outdated/missing typings.`
        );
        rejected.forEach((r) => console.error(r));
        throw new Error("Not all CSS typings are up to date!");
      }
    },
  };
};

export const unplugin = createUnplugin(unpluginFactory);
export default unplugin;
