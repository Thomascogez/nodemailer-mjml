
import { readFile } from "fs/promises";
import { minify } from "html-minifier";
import mjml2html from "mjml";
import { render } from "mustache";
import { dirname, join } from "path";

import { defaultPluginOptions } from '../constants/defaultPluginOptions';
import { checkMjmlError } from "../helpers/checkMjmlError";
import { BuildMjmlTemplateOptions } from "../types/BuildMjmlTemplateOptions";
import { IPluginOptions } from "../types/IPluginsOptions";
import { buildLayout } from "./buildLayout";

export const buildMjmlTemplate = async (options: IPluginOptions, sendMailTemplateOptions: BuildMjmlTemplateOptions) => {

    const renderOptions: IPluginOptions = {
        ...defaultPluginOptions,
        ...options,
        mjmlOptions: {
            ...defaultPluginOptions.mjmlOptions,
            ...options.mjmlOptions
        }
    };

    const { templateData, templateName, templateLayoutName, templateLayoutSlots } = sendMailTemplateOptions;
    const mjmlTemplatePath = join(options.templateFolder, `${templateLayoutName ? templateLayoutName : templateName}.mjml`);

    const rawMjmlTemplate = await (async () => {
        if (templateLayoutName) {
            return buildLayout({
                templateFolder: options.templateFolder,
                templateLayoutName,
                templateLayoutSlots: templateLayoutSlots ?? {},
                templatePartialsFolder: options.templatePartialsFolder
            });
        }

        try {
            return await readFile(mjmlTemplatePath, "utf-8");
        } catch {
            throw new Error(`[nodemailer-mjml] - Could not read mjml template at path: ${mjmlTemplatePath}`);
        }
    })();

    const mjmlOutput =  mjml2html(rawMjmlTemplate, {
        filePath: mjmlTemplatePath,
        ...renderOptions.mjmlOptions
    });
    checkMjmlError(mjmlOutput);
    
    const finalHtmlOutput = renderOptions.minifyHtmlOutput ? minify(mjmlOutput.html, renderOptions.htmlMinifierOptions) : mjmlOutput.html;
    const shouldRunMustacheCompiler = !!templateData && Object.keys(templateData ?? {}).length > 0;

    return shouldRunMustacheCompiler ? render(finalHtmlOutput, templateData) : finalHtmlOutput;
};