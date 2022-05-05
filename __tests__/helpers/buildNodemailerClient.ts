import { createTransport } from "nodemailer";
import { MAILDEV_SMTP_ENDPOINT, MAILDEV_SMTP_PORT } from "../constants/mailDev";
import {IPluginOptions, nodemailerMjmlPlugin} from "../../src/index";
export const buildNodemailerTransport = (nodemailerMjmlOptions: IPluginOptions) => {
    const nodeMailerTransport = createTransport({
        host: MAILDEV_SMTP_ENDPOINT,
        port: MAILDEV_SMTP_PORT,
    });

    nodeMailerTransport.use('compile', nodemailerMjmlPlugin(nodemailerMjmlOptions));

    return nodeMailerTransport;
};