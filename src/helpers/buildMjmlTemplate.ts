
import { readFile } from "fs/promises";
import { minify } from "html-minifier";
import mjml2html from "mjml";
import { render } from "mustache";
import { join } from "path";

import { defaultPluginOptions } from '../constants/defaultPluginOptions';
import { checkMjmlError } from "../helpers/checkMjmlError";
import { BuildMjmlTemplateOptions } from "../types/BuildMjmlTemplateOptions";
import { IPluginOptions } from "../types/IPluginsOptions";

export const buildMjmlTemplate = async (options: IPluginOptions, sendMailTemplateOptions: BuildMjmlTemplateOptions ) => {

    const renderOptions: IPluginOptions = {
        ...defaultPluginOptions,
        ...options,
        mjmlOptions: {
            ...defaultPluginOptions.mjmlOptions,
            ...options.mjmlOptions
        }
    };

    const {templateData, templateName} = sendMailTemplateOptions;

    const mjmlTemplatePath = join(options.templateFolder, `${templateName}.mjml`);
    const rawMjmlTemplate = await readFile(mjmlTemplatePath, "utf-8").catch(() => {
        throw new Error(`[nodemailer-mjml] - Could not read mjml template at path: ${mjmlTemplatePath}`);
    });

    const shouldRunMustacheCompiler = !!templateData && Object.keys(templateData ?? {}).length > 0;
    const mustacheRenderedTemplate = shouldRunMustacheCompiler ? render(rawMjmlTemplate, templateData) : rawMjmlTemplate;

    const mjmlOutput = mjml2html(mustacheRenderedTemplate, {
        filePath: mjmlTemplatePath,
        ...renderOptions.mjmlOptions
    });

    checkMjmlError(mjmlOutput);

    const finalHtmlOutput = renderOptions.minifyHtmlOutput ? minify(mjmlOutput.html, renderOptions.htmlMinifierOptions) : mjmlOutput.html;

    return finalHtmlOutput;
};