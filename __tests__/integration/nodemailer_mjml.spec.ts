import { minify } from "html-minifier";
import { join } from "path";
import supertest from "supertest";
import { buildMjmlTemplate } from "../../src";
import { MAILDEV_API_ENDPOINT } from "../constants/mailDev";
import { buildNodemailerTransport } from "../helpers/buildNodemailerClient";

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
            templateFolder: join(__dirname, "../resources")
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
        const expectedOutput = await buildMjmlTemplate(
            { templateFolder: join(__dirname, "../resources") },
            { templateName: "test" }
        );

        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "../resources")
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

    it("should send mail with templateData rendered", async () => {
        const templateData = {
            testKey: "testKey",
            testKeyNested: {
                nestedKey: "nestedKey"
            }
        };

        const expectedOutput = await buildMjmlTemplate(
            { templateFolder: join(__dirname, "../resources") },
            {
                templateName: "test-mustache",
                templateData: {
                    testKey: "testKey",
                    testKeyNested: {
                        nestedKey: "nestedKey"
                    },
                }

            });

        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "../resources")
        });

        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Valid",
            text: "Hello world?",
            templateName: "test-mustache",
            templateData
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        expect(minify(latestReceivedMail.html.toLowerCase())).toBe(expectedOutput.toLowerCase());
    });


    it("should send mail with a template using include", async () => {
        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "../resources")
        });

        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Include",
            templateName: "test-include/test-include"
        });
    });

    describe("Layout", () => {
        it("should fail if layout does not exist", async () => {
            const nodeMailerTransport = buildNodemailerTransport({
                templateFolder: join(__dirname, "../resources")
            });

            await expect(
                nodeMailerTransport.sendMail({
                    from: '"John doe" <john.doe@example.com>',
                    to: "doe.john@.com",
                    subject: "Hello ✔",
                    text: "Hello world?",
                    templateLayoutName: "layout/layoutThatDoesNotExist"
                })
            ).rejects.toThrow();
        });

        it("should send an email with a layout with fallback header", async () => {
            const nodeMailerTransport = buildNodemailerTransport({
                templateFolder: join(__dirname, "../resources"),
                templateSharedFolder: "/include"
            });

            await nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
                text: "Hello world?",
                templateLayoutName: "layout/layout-single-slot"
            });
        });
    });
});