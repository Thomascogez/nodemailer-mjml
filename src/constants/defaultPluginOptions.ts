import { IPluginOptions } from "../types/IPluginsOptions";

export const defaultPluginOptions: Partial<IPluginOptions> = {
    minifyHtmlOutput: true,
    mjmlOptions: {
        validationLevel: "strict"
    }
};