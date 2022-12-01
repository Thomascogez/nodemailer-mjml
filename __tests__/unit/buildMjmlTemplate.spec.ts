import { join } from "path";
import { buildMjmlTemplate } from "../../src";

describe("buildMjmlTemplate", () => {

    it("should fail if template folder does not exist", async () => {
        await expect(buildMjmlTemplate({
            templateFolder: join(__dirname, "folderThatDoesNotExist"),
        }, { templateName: "templateThatDoesNotExist" })).rejects.toThrow();
    });

    it("should fail if template does not exist", async () => {
        await expect(buildMjmlTemplate({
            templateFolder: join(__dirname, "../resources"),
        }, { templateName: "templateThatDoesNotExist" })).rejects.toThrow();
    });

    it("should fail if mjml template is invalid", async () => {
        await expect(buildMjmlTemplate({
            templateFolder: join(__dirname, "../resources"),
        }, { templateName: "test-invalid" })).rejects.toThrow();
    });

    it("should compile a template without template data", async () => {
        const mailHtmlContent = await buildMjmlTemplate({
            templateFolder: join(__dirname, "../resources"),
        }, { templateName: "test" });

        expect(mailHtmlContent).toBeDefined();
    });

    it("should compile a template with template data and html content should be replaced", async () => {
        const mailHtmlContent = await buildMjmlTemplate({
            templateFolder: join(__dirname, "../resources"),
        },
            {
                templateName: "test-mustache",
                templateData: {
                    testKey: "testKey",
                    testKeyNested: {
                        nestedKey: "nestedKey"
                    }
                }
            });

        expect(mailHtmlContent).toBeDefined();
        expect(mailHtmlContent).toContain("testKey");
        expect(mailHtmlContent).toContain("nestedKey");
    });

    it("should compile a template using mjml-include tag", async () => {
        const mailHtmlContent = await buildMjmlTemplate({
            templateFolder: join(__dirname, "../resources"),
        }, {templateName: "test-include/test-include"});

        expect(mailHtmlContent).toBeDefined();
        expect(mailHtmlContent).toContain("This is a header");
    });
});