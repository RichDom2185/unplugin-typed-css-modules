export const resolveImportInconsistency = <T>(mod: T | { default: T }): T =>
  Object.prototype.hasOwnProperty.call(mod, "default")
    ? (mod as any).default
    : (mod as T);
