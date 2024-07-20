import { IPluginOptions } from "../types/IPluginsOptions";

export const minifyTemplate = async (html: string, templateMinifierOptions: IPluginOptions["templateMinifierOptions"]) => {
    try {
        const htmlnano = await import("htmlnano");

        const minifiedTemplateOutput = await htmlnano.default.process(html, templateMinifierOptions?.options, templateMinifierOptions?.preset);

        return minifiedTemplateOutput.html;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("Cannot find module")) {
                console.warn("[nodemailer-mjml] - Could not import htmlnano, please install it to enable html minification, skipping html minification");
                return html;
            }
        }

        throw error;
    }
};