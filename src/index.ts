import type MailMessage from "nodemailer/lib/mailer/mail-message";
import { buildMjmlTemplate } from "./helpers/buildMjmlTemplate";
import type { IPluginOptions } from "./types/IPluginsOptions";

const nodemailerMjmlPlugin = (options: IPluginOptions) => {
    return (mail: MailMessage, callback: () => void)  =>{
        return buildMjmlTemplate(options, mail, callback);
    };
};

export default nodemailerMjmlPlugin;
export {
    nodemailerMjmlPlugin,
    buildMjmlTemplate,
    IPluginOptions
};
