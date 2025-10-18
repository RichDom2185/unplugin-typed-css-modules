import type { Plugin } from "postcss";
import DtsCreator from "typed-css-modules";
import Core from "typed-css-modules/lib/css-modules-loader-core/index.js";
import { resolveImportInconsistency } from "./utils";

const Creator = resolveImportInconsistency(DtsCreator);
const defaultPlugins = resolveImportInconsistency(Core).defaultPlugins;

export type CssOptions = {
  banner?: string;
  plugins?: Plugin[] | ((getDefaultPlugins: Plugin[]) => Plugin[]) | undefined;
};

const css = ({ banner, plugins = [] }: CssOptions = {}) => {
  const wrapContent = (content: string) =>
    ((banner ?? "") + content).trim() + "\n";
  const dtsCreator = new Creator({
    loaderPlugins:
      typeof plugins === "function"
        ? plugins([...defaultPlugins])
        : [...defaultPlugins, ...plugins],
  });
  return {
    async generate(file: string) {
      const content = await dtsCreator.create(file, undefined, true);
      await content.writeFile(wrapContent);
    },
    async check(file: string) {
      const content = await dtsCreator.create(file, undefined, true);
      const ok = await content.checkFile(wrapContent);
      if (!ok) {
        throw new Error(`Missing/incorrect typings for ${file}`);
      }
    },
  };
};

export default css;
