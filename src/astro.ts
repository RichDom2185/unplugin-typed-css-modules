import type { Options } from ".";
import unplugin, { PLUGIN_NAME } from ".";

export default (options: Options): any => ({
  name: PLUGIN_NAME,
  hooks: {
    "astro:config:setup": async (astro: any) => {
      astro.config.vite.plugins ||= [];
      astro.config.vite.plugins.push(unplugin.vite(options));
    },
  },
});
