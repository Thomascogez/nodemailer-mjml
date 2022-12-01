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
        templateLayoutName: "layoutTemplate",
        templateLayoutSlots: {
            header: "partials/header",
            content: "partials/content",
            footer: "partials/footer",
        },
        templateData: {
            content: {
                imageURL: "http://5vph.mj.am/img/5vph/b/1g8pi/068ys.png"
            }
        }
    });
};

sendTemplatedEmail();