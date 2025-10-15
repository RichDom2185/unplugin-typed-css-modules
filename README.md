# unplugin-typed-css-modules

> Generate type-safe declaration files from CSS and SCSS modules. Works with Vite, Webpack, Rspack, and more.

## Features

- Supports `.module.css`, `.module.scss`, and `.module.sass` files
- Works with Vite, Webpack, Rspack, and many more via [Unplugin](https://unplugin.unjs.io/)
- Generates TypeScript declaration (`.d.ts`) files alongside your stylesheets
- Enables type-safe checking and autocompletion for CSS/SCSS module class names
- Only processes changed files for performance
- Handle both CSS and SCSS modules in a single plugin
- Fail builds if there are missing/invalid types

## Installation

```bash
npm install --save-dev unplugin-typed-css-modules
# or
yarn add -D unplugin-typed-css-modules
# or
pnpm install --save-dev unplugin-typed-css-modules
```

## Usage

For more detailed usage instructions, please refer to the [Unplugin documentation](https://unplugin.unjs.io/guide/#bundler-framework-integration).

- Vite

  ```ts
  // vite.config.ts
  import { defineConfig } from 'vite'
  import typedCssModules from 'unplugin-typed-css-modules/vite'
  
  export default defineConfig({
    plugins: [
      typedCssModules({
        // options
      }),
    ],
  })
  ```

- Webpack

  ```ts
  // webpack.config.js
  /** @type {import('webpack').Configuration} */
  const config = {
    plugins: [
      require('unplugin-typed-css-modules/webpack')({
        // options
      }),
    ],
  }

  module.exports = config
  ```

### Recommended: Configure Your Project Environment

- When committing the generated `.d.ts` files to git, to hide them from Pull Request reviews on GitHub, mark them as auto-generated using a `.gitattributes` file:

  ```properties
  *.module.css.d.ts linguist-generated=true
  *.module.scss.d.ts linguist-generated=true
  *.module.sass.d.ts linguist-generated=true
  ```

- Ignore the generated files from Prettier/other formatters:

  ```gitignore
  # .prettierignore or equivalent
  **/*.module.css.d.ts
  **/*.module.scss.d.ts
  **/*.module.sass.d.ts
  ```

  **Note:** Even though the files come with a `// prettier-ignore` comment, there is no way to disable Prettier from formatting a whole file, so this step is almost always necessary if you are using Prettier

- Ignore the generated files from ESLint checks:

  E.g. if you are using Flat Config:
  
  ```js
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  export default defineConfig(
    {
      ignores: [
        '**/*.module.css.d.ts',
        '**/*.module.scss.d.ts',
        '**/*.module.sass.d.ts'
      ]
    },
    // The rest of your config goes here...
  )
  ```

  **Note:** The generated files already come with a `/* eslint-disable */` comment by default, so this step is only needed if:
  - You care about performance and want to avoid ESLint parsing the files altogether, or
  - Your ESLint setup includes `--report-unused-disable-directives` which might mistakenly flag these files as errors

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/), with the sole exception that [Environment Options](#environment-options) ***may*** introduce API changes in minor/patch releases. These API changes to environment options are not necessarily breaking, but may require changes to your build setup. Any such changes will be documented in the release notes.

I am maintaining this project in my spare time, so maintaining multiple minor versions is not feasible. As such, any *patch* changes will not be backported to older *minor* versions. Please update to the latest *minor* version to get the latest bug fixes.

## Options

For now, the plugin accepts two options:

### `css: boolean`

- Enables or disables processing of `.module.css` files.
- Default: `true`

### `scss: boolean`

- Enables or disables processing of `.module.scss` and `.module.sass` files.
- Default: `false`

## FAQ

| Question | Answer                                                                                                                                                                                                                                                                                                               |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **What** | Autogenerate TypeScript declaration (`.d.ts`) files for your CSS and/or SCSS modules (`.module.css`/`.module.scss`/`.module.sass`).                                                                                                                                                                                  |
| **Why**  | To provide a seamless developer experience when working with both CSS/SCSS modules in one plugin.                                                                                                                                                                                                                    |
| **How**  | A wrapper around [`typed-css-modules`](https://github.com/Quramy/typed-css-modules) and [`typed-scss-modules`](https://github.com/skovy/typed-scss-modules) for CSS and SCSS files, respectively. The plugin watches for changes to CSS/SCSS module files and updates the corresponding `.d.ts` files automatically. |

The plugin was originally created to fulfil personal needs and is designed to be simple and easy to use, with minimal configuration required. This should be able to cover the most common use cases.

In the future, I might add support for more features like further customization or performance optimizations. Feel free to open an [issue](https://github.com/RichDom2185/unplugin-typed-css-modules/issues) or a PR if you have any suggestions or feature requests and I will try to address them as soon as possible.

## Compatibility

This plugin is built using [Unplugin](https://github.com/unjs/unplugin), so in theory, it should work with any build tool that supports unplugin, including but not limited to:

- Vite
- Webpack/Rspack
- Rollup/Rolldown
- Meta-frameworks (Astro, Nuxt, etc.)

This plugin is **actively being used** (and therefore validated) with:

- Vite
- Webpack (via [Create React App](https://create-react-app.dev/) + [CRACO](https://craco.js.org/))

Please feel free to file an issue if you encounter any problems with using the plugin in your setup, even if you are using a build tool that is not actively being tested against.

## License

[MIT License](https://github.com/RichDom2185/unplugin-typed-css-modules?tab=MIT-1-ov-file) &copy; 2025
