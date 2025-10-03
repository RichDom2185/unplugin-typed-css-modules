import DtsCreator from "typed-css-modules";
import Core from "typed-css-modules/lib/css-modules-loader-core/index.js";
import { resolveImportInconsistency } from "./utils";

const Creator = resolveImportInconsistency(DtsCreator);
const defaultPlugins = resolveImportInconsistency(Core).defaultPlugins;

export type CssOptions = {
  banner?: string;
};

const css = ({ banner }: CssOptions = {}) => {
  const wrapContent = (content: string) =>
    ((banner ?? "") + content).trim() + "\n";
  const dtsCreator = new Creator({
    loaderPlugins: [
      ...defaultPlugins,
      // TODO: Allow supporting custom plugins?
    ],
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
