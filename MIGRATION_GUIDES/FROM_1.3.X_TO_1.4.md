## Migration Guide from 1.3.x to 1.4.0

## Breaking Changes
- `html-minifier` has been removed from the dependencies and it's now replaced by `htmlnano` (as a peer dependency) (reported by #268).
- The `minifyHtmlOutput` is now `false` by default, since `htmlnano` require a bit more configuration to work properly.
- The `htmlMinifierOptions` as been rename to `templateMinifierOptions` and it's now an object with the following properties:
  - `options`: (optional) Wich is the options object passed to `htmlnano`.
  - `preset`: (optional) Which is the preset used by `htmlnano`.

## How to migrate

### 1. Update the `nodemailer-mjml` version

```bash
npm install nodemailer-mjml@latest
or
yarn add nodemailer-mjml@latest
```
### 2. If you where using minifyHtmlOutput, you will need to enable it explicitly in the options

### 3. Install `htmlnano` dependency (as a dev dependency)

```bash
npm install --save-dev htmlnano
or
yarn add -D htmlnano
```
> [!NOTE]
> If you want `html` minification, you will need to also install `posthtml`
> If you want `html` minification, you will need to also install `postcss` and `cssnano`
> If you want `js` minification, you will need to also install `terser`
> If you want `svg` minification, you will need to also install `svgo`

More information about the `htmlnano` options can be found [here](https://htmlnano.netlify.app/).
:::

### 4. Update the plugin options by removing `htmlMinifierOptions` and adding `templateMinifierOptions` with your desired options