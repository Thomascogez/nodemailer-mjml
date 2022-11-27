import { Options } from "nodemailer/lib/mailer";
import { IPluginOptions } from "./IPluginsOptions";

export type BuildLayoutTemplateOptions = {
    templateLayoutName: NonNullable<Options["templateLayoutName"]>;
    templateLayoutSlots: NonNullable<Options["templateLayoutSlots"]>;
    templateSharedFolder: NonNullable<IPluginOptions["templateSharedFolder"]>;
    templateFolder: IPluginOptions["templateFolder"];
}