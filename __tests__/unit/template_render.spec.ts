import { join } from "path";

import { describe, it, expect } from "vite-plus/test";

import { buildMjmlTemplate } from "../../src";

describe("Template render", () => {
  describe("Default template", () => {
    describe("Without template data", () => {
      it("should send mail using a template without html minification and snapshot should match", async () => {
        const buildedTemplate = await buildMjmlTemplate(
          {
            templateFolder: join(__dirname, "../resources"),
            mjmlOptions: {
              minify: false,
            },
          },
          {
            templateName: "test",
          },
        );

        expect(buildedTemplate).toMatchSnapshot();
      });

      it("should send mail using a template with html minification and snapshot should match", async () => {
        const buildedTemplate = await buildMjmlTemplate(
          {
            templateFolder: join(__dirname, "../resources"),
            mjmlOptions: {
              minify: true,
            },
          },
          {
            templateName: "test",
          },
        );

        expect(buildedTemplate).toMatchSnapshot();
      });
    });

    describe("With template data", () => {
      it("should send mail using a template without html minification and snapshot should match", async () => {
        const templateData = {
          testKey: "testKey",
          testKeyNested: {
            nestedKey: "nestedKey",
          },
        };

        const buildedTemplate = await buildMjmlTemplate(
          {
            templateFolder: join(__dirname, "../resources"),
            mjmlOptions: {
              minify: false,
            },
          },
          {
            templateName: "test-mustache",
            templateData,
          },
        );
        expect(buildedTemplate).toMatchSnapshot();
      });

      it("should send mail using a template with html minification and snapshot should match", async () => {
        const templateData = {
          testKey: "testKey",
          testKeyNested: {
            nestedKey: "nestedKey",
          },
        };

        const buildedTemplate = await buildMjmlTemplate(
          {
            templateFolder: join(__dirname, "../resources"),
            mjmlOptions: {
              minify: true,
            },
          },
          {
            templateName: "test-mustache",
            templateData,
          },
        );
        expect(buildedTemplate).toMatchSnapshot();
      });
    });
  });

  describe("Layout template", () => {
    describe("Without template data", () => {
      describe("With fallback slots", () => {
        it("should send an email with a layout and fallback header without html minification and snapshot should match", async () => {
          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              templatePartialsFolder: "/include",
              mjmlOptions: {
                minify: false,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });

        it("should send an email with a layout and fallback header with html minification and snapshot should match", async () => {
          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              templatePartialsFolder: "/include",
              mjmlOptions: {
                minify: true,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });
      });

      describe("Without fallback slots", () => {
        it("should send an email with a layout and fallback header without html minification and snapshot should match", async () => {
          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              mjmlOptions: {
                minify: false,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });

        it("should send an email with a layout and fallback header with html minification and snapshot should match", async () => {
          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              mjmlOptions: {
                minify: true,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });
      });
    });

    describe("With template data", () => {
      describe("With fallback slots", () => {
        it("should send an email with a layout and fallback header without html minification and snapshot should match", async () => {
          const templateData = {
            headerTitle: "Header title",
            content: "Content",
            footerText: "Footer text",
          };

          const templateLayoutSlots = {
            customContent: "include/content-mustache",
            customFooter: "include/footer-mustache",
          };

          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              templatePartialsFolder: "/include",
              mjmlOptions: {
                minify: false,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
              templateLayoutSlots,
              templateData,
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });

        it("should send an email with a layout and fallback header with html minification and snapshot should match", async () => {
          const templateData = {
            headerTitle: "Header title",
            content: "Content",
            footerText: "Footer text",
          };

          const templateLayoutSlots = {
            customContent: "include/content-mustache",
            customFooter: "include/footer-mustache",
          };

          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              templatePartialsFolder: "/include",
              mjmlOptions: {
                minify: true,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
              templateLayoutSlots,
              templateData,
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });
      });

      describe("Without fallback slots", () => {
        it("should send an email with a layout and fallback header without html minification and snapshot should match", async () => {
          const templateData = {
            headerTitle: "Header title",
            content: "Content",
            footerText: "Footer text",
          };

          const templateLayoutSlots = {
            customHeader: "include/header-mustache",
            customContent: "include/content-mustache",
            customFooter: "include/footer-mustache",
          };

          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              mjmlOptions: {
                minify: false,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
              templateLayoutSlots,
              templateData,
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });

        it("should send an email with a layout and fallback header with html minification and snapshot should match", async () => {
          const templateData = {
            headerTitle: "Header title",
            content: "Content",
            footerText: "Footer text",
          };

          const templateLayoutSlots = {
            customHeader: "include/header-mustache",
            customContent: "include/content-mustache",
            customFooter: "include/footer-mustache",
          };

          const buildedTemplate = await buildMjmlTemplate(
            {
              templateFolder: join(__dirname, "../resources"),
              mjmlOptions: {
                minify: true,
              },
            },
            {
              templateLayoutName: "layout/layout-single-slot",
              templateLayoutSlots,
              templateData,
            },
          );

          expect(buildedTemplate).toMatchSnapshot();
        });
      });
    });
  });
});
