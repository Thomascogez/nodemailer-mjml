import { Options } from "nodemailer/lib/mailer";

export type BuildMjmlTemplateOptions = Pick<Options, "templateData" | "templateName">