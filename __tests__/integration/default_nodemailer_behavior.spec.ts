import { buildNodemailerTransport } from "../helpers/buildNodemailerClient";
import supertest from "supertest";
import { MAILDEV_API_ENDPOINT } from "../constants/mailDev";
import { join } from "path";
describe("Default nodemailer behavior", () => {
    it("should send a normal html mail without failing", async () => {
        const nodeMailerTransport = buildNodemailerTransport({ templateFolder: join(__dirname, "../resources") });

        const mailHtmlContent = "<b>Hello world?</b>";
        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Hello ✔",
            text: "Hello world?",
            html: mailHtmlContent,
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        expect(latestReceivedMail.html).toBe(mailHtmlContent);
    });

    it("should send a normal text mail without failing", async () => {
        const nodeMailerTransport = buildNodemailerTransport({ templateFolder: join(__dirname, "../resources") });

        const mailTextContent = "Hello world?";
        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Hello ✔",
            text: mailTextContent,
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        
        expect(latestReceivedMail.text).toBe(`${mailTextContent}\n`);
    });
});