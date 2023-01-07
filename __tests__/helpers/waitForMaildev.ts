import supertest from "supertest";
import { MAILDEV_API_ENDPOINT } from "../constants/mailDev";

export const waitForMaildev = async (retries = 10): Promise<void> => {
    const response = await supertest(MAILDEV_API_ENDPOINT).get("/healthz");

    if (response.statusCode === 200) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if(retries === 0) {
        throw new Error("Could not reach maildev after 10 retries");
    }

    return await waitForMaildev(retries - 1);
};