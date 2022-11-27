import { readFile } from "fs/promises";
import { join } from "path";
import { buildLayout } from "../../src/helpers/buildLayout";

describe("Build layout", () => {

    it("should fail if template folder does not exist", async () => {
        await expect(buildLayout({
            templateFolder: join(__dirname, "folderThatDoesNotExist"),
            templateLayoutName: "layout/layout-single-slot",
            templateLayoutSlots: {},
            templateSharedFolder: "/shared"
        })).rejects.toThrow();
    });

    it("should fail if layout file does not exist", async () => {
        await expect(buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-that-does-not-exist",
            templateLayoutSlots: {},
            templateSharedFolder: "/shared"
        })).rejects.toThrow();
    });

    it("should compile a layout file without any slots and templateSlots option is empty", async () => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-without-slots",
            templateLayoutSlots: {},
            templateSharedFolder: "/shared"
        });

        const originalLayoutContent = await readFile(join(__dirname, "../resources/layout/layout-without-slots.mjml"), "utf8");

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).toEqual(originalLayoutContent);
    });

    it("should compile a layout file without any slots and templateSlots option has keys", async () => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-without-slots",
            templateLayoutSlots: {
                header: "/includes/header",
            },
            templateSharedFolder: "/shared"
        });

        const originalLayoutContent = await readFile(join(__dirname, "../resources/layout/layout-without-slots.mjml"), "utf8");

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).toEqual(originalLayoutContent);
    });

    it("should compile a layout file with slots and templateSlots", async () => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-single-slot",
            templateLayoutSlots: {
                header: "/include/header",
            },
            templateSharedFolder: "/include"
        });

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).toContain(`<mj-include path="/include/header.mjml" />`);
    });

    it("should compile a layout file with slots and fallback to default slot file", async () => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-single-slot",
            templateLayoutSlots: {},
            templateSharedFolder: "/include"
        });

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).toContain(`<mj-include path="/include/header.mjml" />`);
    });

    it("should not render any slots fallback slots content files does not exist", async() => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-multiple-slots",
            templateLayoutSlots: {
            },
            templateSharedFolder: "/include"
        });

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).not.toContain(`<mj-include path="/include/header-that-does-not-exist.mjml" />`);
        expect(buildedLayout).not.toContain(`<mj-include path="/include/content-that-does-not-exist.mjml" />`);
        expect(buildedLayout).not.toContain(`<mj-include path="/include/customFooter.mjml" />`);

        expect(buildedLayout).not.toContain(`{{ slots:customHeader }}`);
        expect(buildedLayout).not.toContain(`{{ slots:customContent }}`);
        expect(buildedLayout).not.toContain(`{{ slots:customFooter }}`);
    });

    it("should render given slots", async() => {
        const buildedLayout = await buildLayout({
            templateFolder: join(__dirname, "../resources"),
            templateLayoutName: "layout/layout-multiple-slots",
            templateLayoutSlots: {
                customHeader: "/include/header",
                customContent: "/include/content",
                customFooter: "/include/customFooter"
            },
            templateSharedFolder: "/include"
        });

        expect(buildedLayout).toBeDefined();
        expect(buildedLayout).toContain(`<mj-include path="/include/header.mjml" />`);
        expect(buildedLayout).toContain(`<mj-include path="/include/content.mjml" />`);
        expect(buildedLayout).toContain(`<mj-include path="/include/customFooter.mjml" />`);

        expect(buildedLayout).not.toContain(`{{ slots:customHeader }}`);
        expect(buildedLayout).not.toContain(`{{ slots:customContent }}`);
        expect(buildedLayout).not.toContain(`{{ slots:customFooter }}`);
    });
});