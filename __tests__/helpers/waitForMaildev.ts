import { buildNodemailerTransport } from './buildNodemailerClient';
import supertest from "supertest";
import { MAILDEV_API_ENDPOINT } from "../constants/mailDev";

export const waitFor = (waitingTimeoutInMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, waitingTimeoutInMs);
    });
};

export const waitForMaildev = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const testMaildevConnection = async (retries = 10) => {
            if (retries <= 0) {
                return reject();
            }
            try {
                await buildNodemailerTransport({ templateFolder: "" }).sendMail({
                    from: '"John doe" <john.doe@example.com>',
                    to: "doe.john@.com",
                    subject: "Hello ✔",
                    text: "Hello world?",
                });
                const response = await supertest(MAILDEV_API_ENDPOINT).get("/email");

                if (response.status !== 200) {
                    throw new Error("Maildev not ready");
                }

                if (response.body?.length > 0) {
                    return resolve();
                }
                throw new Error("Maildev not ready");
            } catch (error) {
                await waitFor(1000);
                testMaildevConnection(retries - 1);
            }
        };
        testMaildevConnection();
    });
};