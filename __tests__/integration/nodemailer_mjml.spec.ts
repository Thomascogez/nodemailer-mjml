import { join } from "path";
import supertest from "supertest";
import { MAILDEV_API_ENDPOINT } from "../constants/mailDev";
import { buildNodemailerTransport } from "../helpers/buildNodemailerClient";
import { waitForMaildev } from "../helpers/waitForMaildev";

describe("Nodemailer mjml", () => {
    beforeAll(async() => {
        await waitForMaildev();
    });
    
    it("should fail if template does not exist", async () => {
        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "folderThatDoesNotExist")
        });

        await expect(
            nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
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
                templateName: "test-invalid"
            })
        ).rejects.toThrow();
    });

    it("should send mail", async () => {
        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "../resources")
        });

        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Valid",
            templateName: "test"
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        
        expect(latestReceivedMail.html).toContain("resources/test.mjml");
    });

    it("should send mail with templateData rendered", async () => {
        const templateData = {
            testKey: "testKey",
            testKeyNested: {
                nestedKey: "nestedKey"
            }
        };

        const nodeMailerTransport = buildNodemailerTransport({
            templateFolder: join(__dirname, "../resources")
        });

        await nodeMailerTransport.sendMail({
            from: '"John doe" <john.doe@example.com>',
            to: "doe.john@.com",
            subject: "Valid",
            templateName: "test-mustache",
            templateData
        });

        const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
        expect(receivedMailResponse.status).toBe(200);

        const latestReceivedMail = receivedMailResponse.body.pop();
        expect(latestReceivedMail.html).toContain("resources/test-mustache.mjml");
        expect(latestReceivedMail.html).toContain(templateData.testKey);
        expect(latestReceivedMail.html).toContain(templateData.testKeyNested.nestedKey);
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
                    templateLayoutName: "layout/layoutThatDoesNotExist"
                })
            ).rejects.toThrow();
        });

        it("should send an email with a layout and fallback header", async () => {
            const nodeMailerTransport = buildNodemailerTransport({
                templateFolder: join(__dirname, "../resources"),
                templatePartialsFolder: "/include"
            });

            await nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
                templateLayoutName: "layout/layout-single-slot",
                templateData: {
                    templateData: "templateData"
                }
            });

            const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
            expect(receivedMailResponse.status).toBe(200);

            const latestReceivedMail = receivedMailResponse.body.pop();
            expect(latestReceivedMail.html).toContain("resources/layout/layout-single-slot.mjml");
            expect(latestReceivedMail.html).toContain("This is a header");
            expect(latestReceivedMail.html).toContain("templateData");
        });

        it("should send an email with rendered layout slots", async () => {
            const templateData = {
                headerTitle: "Header title",
                content: "Content",
                footerText: "Footer text"
            };

            const templateLayoutSlots = {
                customHeader: "include/header-mustache",
                customContent: "include/content-mustache",
                customFooter: "include/footer-mustache",
            };

            const nodeMailerTransport = buildNodemailerTransport({
                templateFolder: join(__dirname, "../resources"),
            });

            await nodeMailerTransport.sendMail({
                from: '"John doe" <john.doe@example.com>',
                to: "doe.john@.com",
                subject: "Hello ✔",
                templateLayoutName: "layout/layout-multiple-slots",
                templateLayoutSlots,
                templateData
            });

            const receivedMailResponse = await supertest(MAILDEV_API_ENDPOINT).get("/email");
            expect(receivedMailResponse.status).toBe(200);

            const latestReceivedMail = receivedMailResponse.body.pop();
            
            expect(latestReceivedMail.html).toContain("resources/layout/layout-multiple-slot.mjml");
            expect(latestReceivedMail.html).toContain(templateData.content);
            expect(latestReceivedMail.html).toContain(templateData.footerText);
            expect(latestReceivedMail.html).toContain(templateData.headerTitle);
        });
    });
});