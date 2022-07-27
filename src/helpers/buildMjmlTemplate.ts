import type MailMessage from "nodemailer/lib/mailer/mail-message";

import { join } from "path";
import { readFile } from "fs/promises";
import { render } from "mustache";
import { minify } from "html-minifier";
import mjml2html from "mjml";

import { IPluginOptions } from "../types/IPluginsOptions";
import { defaultPluginOptions } from '../constants/defaultPluginOptions';
import { checkMjmlError } from "../helpers/checkMjmlError";

export const buildMjmlTemplate = async (options: IPluginOptions, mail: MailMessage, callback: (err?: unknown) => void) => {
    if (mail.data.html || !mail.data?.templateName) return callback();

    const renderOptions: IPluginOptions = {
        ...defaultPluginOptions,
        ...options,
        mjmlOptions: {
            ...defaultPluginOptions.mjmlOptions,
            ...options.mjmlOptions
        }
    };

    try {
        const mjmlTemplatePath = join(options.templateFolder, `${mail.data.templateName}.mjml`);
        const rawMjmlTemplate = await readFile(mjmlTemplatePath, "utf-8").catch(() => {
            throw new Error(`[nodemailer-mjml] - Could not read mjml template at path: ${mjmlTemplatePath}`);
        });
        
        const shouldRunMustacheCompiler =  'templateData' in mail.data;
        const mustacheRenderedTemplate = shouldRunMustacheCompiler ? render(rawMjmlTemplate, mail.data.templateData) : rawMjmlTemplate;

        const mjmlOutput = mjml2html(mustacheRenderedTemplate, {
            filePath: mjmlTemplatePath,
            ...renderOptions.mjmlOptions
        });
        checkMjmlError(mjmlOutput);

        const finalHtmlOutput = renderOptions.minifyHtmlOutput ? minify(mjmlOutput.html, renderOptions.htmlMinifierOptions) : mjmlOutput.html;

        Object.assign(mail.data, { html: finalHtmlOutput });

        return callback();
    } catch (error) {
        return callback(error);
    }
};