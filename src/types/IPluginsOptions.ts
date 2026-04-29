import type { MJMLParsingOptions } from "mjml-core";

export interface IPluginOptions {
  templateFolder: string;
  templatePartialsFolder?: string;
  mjmlOptions?: MJMLParsingOptions; // omitting deprecated mjml from the interface
}
