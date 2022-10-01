# nodemailer-mjml

**nodemailer-mjml** is a plug-and-play solution for sending **MJML** mail using **nodemailer**. It not only bring a compatibility layer between **MJML** and **nodemailer** it also allow to render dynamic content using **mustache** templating

## Installation

```sh
yarn add nodemailer-mjml
# or using npm install nodemailer-mjml
```

```ts
import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

const transport = createTransport({...});

// Register nodemailer-mjml to your nodemailer transport
transport.use('compile', nodemailerMjmlPlugin({/*Pass desired plugin options here*/}));

```

## Docs

### Plugin options

> Plugin options are defined by the **IPluginOptions** interface

| option               | type               | description                                                                                                               | default                     |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| templateFolder       | string             | Path of the dir containing your **MJML** template                                                                         | undefined                   |
| mjmlOptions?         | MJMLParsingOptions | Options that would be passed to **MJML** compiler (see more) [mjml doc](https://github.com/mjmlio/mjml)                   | {validationLevel: "strict"} |
| minifyHtmlOutput?    | boolean            | use to enable/disable html minification using **html-minifier**                                                           | true                        |
| htmlMinifierOptions? | Options            | Options that would be passed to **html-minifier** (see more) [html-minifier doc](https://github.com/kangax/html-minifier) | undefined                   |

### Send mail options

> **nodemailer-mjml** bring two new params to the `sendMail` function

| options       | type   | description                                                             | default   |
| ------------- | ------ | ----------------------------------------------------------------------- | --------- |
| templateName? | string | Name of the file (without extension) corresponding to your template     | undefined |
| templateData? | Object | Object containing data that would be used by mustache template compiler | undefined |

## Tests

Run test

```sh
# watch mode
docker compose run --rm tests yarn test:watch
#single run
docker compose run --rm tests yarn test
```

## Example usage

```ts
import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";
import { join } from "path";

const transport = createTransport({});

// Register nodemailer-mjml to your nodemailer transport
transport.use(
  "compile",
  nodemailerMjmlPlugin({ templateFolder: join(__dirname, "mailTemplates") })
);

const sendTemplatedEmail = async () => {
  await transport.sendMail({
    from: '"John doe" <john.doe@example.com>',
    to: "doe.john@.com",
    subject: "Welcome",
    templateName: "hello",
    templateData: {
      userName: "John doe",
    },
  });
};

sendTemplatedEmail();
```
> If you want to try the above example check the **examples** folder
