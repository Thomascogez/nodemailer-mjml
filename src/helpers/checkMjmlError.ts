import type { MJMLParseResults } from "mjml-core";
export const checkMjmlError = (mjmlOutput: MJMLParseResults) => {
    if (mjmlOutput.errors.length > 0) {
        const readableErrorMessage = mjmlOutput.errors.map((error) => error.formattedMessage).join(", ");

        throw new Error(`[nodemailer-mjml] - Mjml compiler fail with following errors: ${readableErrorMessage}`);
    }
};