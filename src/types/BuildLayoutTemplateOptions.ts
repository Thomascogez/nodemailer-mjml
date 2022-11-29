import { Options } from "nodemailer/lib/mailer";
import { IPluginOptions } from "./IPluginsOptions";

export type BuildLayoutTemplateOptions = {
    templateLayoutName: NonNullable<Options["templateLayoutName"]>;
    templateLayoutSlots: NonNullable<Options["templateLayoutSlots"]>;
    templatePartialsFolder: NonNullable<IPluginOptions["templatePartialsFolder"]>;
    templateFolder: IPluginOptions["templateFolder"];
}