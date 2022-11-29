import { PluginFunction } from "nodemailer/lib/mailer";
import type MailMessage from "nodemailer/lib/mailer/mail-message";


import type { IPluginOptions } from "./types/IPluginsOptions";
import type { BuildLayoutTemplateOptions } from "./types/BuildLayoutTemplateOptions";
import type { BuildMjmlTemplateOptions } from "./types/BuildMjmlTemplateOptions";

import { buildMjmlTemplate } from "./helpers/buildMjmlTemplate";
import { buildLayout } from './helpers/buildLayout';
declare module 'nodemailer/lib/mailer' {
    interface Options {
        templateName?: string;
        templateData?: Record<never, never>
        templateLayoutName?: string;
        templateLayoutSlots?: Record<string, string>
    }
}

const nodemailerMjmlPlugin = (options: IPluginOptions): PluginFunction => {
    return async (mail: MailMessage, callback: (err?: Error | null) => void) => {
        if (mail.data.html || (!mail.data?.templateName && !mail.data?.templateLayoutName)) return callback();

        try {
            const mailHtmlContent = await buildMjmlTemplate(options, mail.data);

            Object.assign(mail.data, { html: mailHtmlContent });
            return callback();
        } catch (error) {
            return callback(error as Error | null);
        }
    };
};

export default nodemailerMjmlPlugin;

export {
    nodemailerMjmlPlugin,
    buildMjmlTemplate,
    buildLayout,
    BuildLayoutTemplateOptions,
    BuildMjmlTemplateOptions,
    IPluginOptions
};
