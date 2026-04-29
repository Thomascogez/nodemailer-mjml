import { IPluginOptions } from "../types/IPluginsOptions";

export const defaultPluginOptions: Partial<IPluginOptions> = {
  mjmlOptions: {
    ignoreIncludes: false,
    validationLevel: "strict",
    minify: true,
  },
};
