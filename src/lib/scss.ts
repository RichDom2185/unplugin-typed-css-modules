import DtsCreator from "typed-scss-modules";
import type { CLIOptions as Options } from "typed-scss-modules/dist/lib/core";
import { resolveImportInconsistency } from "./utils";

const generator = resolveImportInconsistency(DtsCreator);

export type ScssOptions = {
  banner?: string;
};

/**
 * Taken from https://github.com/skovy/typed-scss-modules#cli-options.
 */
const defaultScssOptions: Options = {
  banner: "",
  ignore: [],
  ignoreInitial: false,
  exportType: "named",
  exportTypeName: "ClassNames",
  exportTypeInterface: "Styles",
  listDifferent: false,
  quoteType: "single",
  updateStaleOnly: false,
  watch: false,
  logLevel: "verbose",
  outputFolder: null,
  allowArbitraryExtensions: false,
  implementation: "node-sass",
};

const scss = ({ banner }: ScssOptions = {}) => {
  /**
   * Adapted to align more closely with typed-css-modules output.
   */
  const opts: Options = {
    ...defaultScssOptions,
    // Trim the end to match ts behavior of css.ts
    banner: banner?.trimEnd() ?? "",
    exportType: "default",
    nameFormat: "none",
    quoteType: "double",
    implementation: "sass",
    logLevel: "error",
  };

  return {
    async generate(file: string) {
      await generator(file, opts);
    },
    async check(file: string) {
      await generator(file, { ...opts, listDifferent: true });
    },
  };
};

export default scss;
