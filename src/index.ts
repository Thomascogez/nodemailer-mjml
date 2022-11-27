import { PluginFunction } from "nodemailer/lib/mailer";
import type MailMessage from "nodemailer/lib/mailer/mail-message";
import { buildMjmlTemplate } from "./helpers/buildMjmlTemplate";
import type { IPluginOptions } from "./types/IPluginsOptions";
declare module 'nodemailer/lib/mailer' {
    interface Options {
        templateName?: string;
        templateData?: Record<never, never>
    }
}

const nodemailerMjmlPlugin = (options: IPluginOptions): PluginFunction => {
    return async (mail: MailMessage, callback: (err?: Error | null) => void) => {
        if (mail.data.html || !mail.data?.templateName) return callback();

        try {
            const { templateData, templateName } = mail.data;
            const mailHtmlContent = await buildMjmlTemplate(options, { templateName, templateData });

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
    IPluginOptions
};
