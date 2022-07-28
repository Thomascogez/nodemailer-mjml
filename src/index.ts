import type MailMessage from "nodemailer/lib/mailer/mail-message";
import { buildMjmlTemplate } from "./helpers/buildMjmlTemplate";
import type { IPluginOptions } from "./types/IPluginsOptions";
declare module 'nodemailer/lib/mailer' {
    interface Options {
        templateName?: string;
        templateData?: Record<any, any>
    }
}

const nodemailerMjmlPlugin = (options: IPluginOptions) => {
    return async (mail: MailMessage, callback: (err?: unknown) => void) => {
        if (mail.data.html || !mail.data?.templateName) return callback();

        try {
            const { templateData, templateName } = mail.data;
            const mailHtmlContent = await buildMjmlTemplate(options, templateName, templateData);

            Object.assign(mail.data, { html: mailHtmlContent });
            return callback();
        } catch (error) {
            return callback(error);
        }
    };
};

export default nodemailerMjmlPlugin;

export {
    nodemailerMjmlPlugin,
    buildMjmlTemplate,
    IPluginOptions
};
