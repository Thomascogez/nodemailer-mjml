import { IPluginOptions } from "../types/IPluginsOptions";

export const defaultPluginOptions: Partial<IPluginOptions> = {
    minifyHtmlOutput: false,
    mjmlOptions: {
        validationLevel: "strict"
    },
};