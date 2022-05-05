import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "../src/index";
import { join } from "path";

const transport = createTransport({
    host: "localhost",
    port: 25
});

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