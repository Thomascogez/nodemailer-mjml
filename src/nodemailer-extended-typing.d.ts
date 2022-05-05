import "nodemailer/lib/mailer";

declare module 'nodemailer/lib/mailer' {
    interface Options {
        templateName?: string;
        templateData?: Record<any, any>
    }
}