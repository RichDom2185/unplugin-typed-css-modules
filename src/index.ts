import fs from "node:fs";
import { glob } from "tinyglobby";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import cssGenerator from "./lib/css";

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
};

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
  if (opts.scss) {
    console.warn(
      "[unplugin-typed-css-modules] SCSS is not supported yet, this option will be ignored."
    );
    opts.scss = false;
  }
  const fileExts = [
    ...(opts.css ? ["css"] : []),
    ...(opts.scss ? ["scss", "sass"] : []),
  ];
  const fileExtRegex = new RegExp(`\\.module\\.(${fileExts.join("|")})$`);
  const withBraces =
    fileExts.length === 1 ? fileExts[0] : `{${fileExts.join(",")}}`;
  const fileExtGlob = `**/*.module.${withBraces}`;

  const css = cssGenerator({ banner: PREFIX });
  return {
    name: "unplugin-starter",
    async watchChange(id, { event }) {
      if (!fileExtRegex.test(id)) return;
      if (event === "delete") {
        const dtsFile = id + ".d.ts";
        if (fs.existsSync(dtsFile)) {
          fs.unlinkSync(dtsFile);
        }
        return;
      }
      await css.generate(id);
    },
    async writeBundle() {
      const dirname = process.cwd();
      const files = await glob(fileExtGlob, { cwd: dirname, absolute: true });
      const results = await Promise.allSettled(
        // Fail the build if typings are out of date
        files.map((file) => css.check(file))
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
