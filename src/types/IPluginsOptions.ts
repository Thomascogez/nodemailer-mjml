import type { MJMLParsingOptions } from "mjml-core";
import type { Options } from "html-minifier";

export interface IPluginOptions {
    templateFolder: string;
    templateSharedFolder?: string;
    mjmlOptions?: Omit<MJMLParsingOptions, "beautify" | "minify">; // omitting deprecated mjml from the interface
    minifyHtmlOutput?: boolean;
    htmlMinifierOptions?: Options
}