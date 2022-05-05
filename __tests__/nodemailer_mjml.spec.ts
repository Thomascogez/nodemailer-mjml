import * as _ from "../src/nodemailer-extended-typing";
import { join } from "path";
import { buildNodemailerTransport } from "./helpers/buildNodemailerClient";
import  mjml2html from 'mjml';
import { readFile } from "fs/promises";
import { minify } from "html-minifier";
import supertest from "supertest";
import { MAILDEV_API_ENDPOINT } from "./constants/mailDev";

describe("Nodemailer mjml", () => {
    it("should fail if template does not exist", async () => {
        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "folderThatDoesNotExist")
        });

        await expect(
            nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
                text: "Hello world?",
                templateName: "test"
            })
        ).rejects.toThrow();
    });

    it("should fail if mjml template is invalid", async () => {
        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "resources")
        });

        await expect(
            nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
                text: "Hello world?",
                templateName: "test-invalid"
            })
        ).rejects.toThrow();
    });

    it("should send mail", async () => {
        const rawTemplate = await readFile(join(__dirname, "resources", "test.mjml"), "utf-8");
        const expectedOutput = minify(mjml2html(rawTemplate).html);

        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "resources")
        });

        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Valid",
            text: "Hello world?",
            templateName: "test"
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        expect(minify(latestReceivedMail.html.toLowerCase())).toBe(expectedOutput.toLowerCase());
    });
});