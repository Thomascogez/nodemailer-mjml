import type { MJMLParsingOptions } from "mjml-core";
import type { HtmlnanoOptions, HtmlnanoPreset } from "htmlnano";

export interface IPluginOptions {
    templateFolder: string;
    templatePartialsFolder?: string;
    mjmlOptions?: Omit<MJMLParsingOptions, "beautify" | "minify">; // omitting deprecated mjml from the interface
    minifyHtmlOutput?: boolean;
    templateMinifierOptions?: {
        options?: HtmlnanoOptions;
        preset?: HtmlnanoPreset

    };

    
}