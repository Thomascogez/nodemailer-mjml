import { createTransport } from "nodemailer";
import { nodemailerMjmlPlugin } from "../src/index";
import { join } from "path";

const transport = createTransport({
    host: "localhost",
    port: 25
});

transport.use(
    "compile",
    nodemailerMjmlPlugin({ templateFolder: join(__dirname, "mailTemplates") })
);

const sendTemplatedEmail = async () => {
    await transport.sendMail({
        from: '"John doe" <john.doe@example.com>',
        to: "doe.john@.com",
        subject: "Welcome",
        templateName: "simpleTemplate",
        templateData: {
            companyLogoURL: "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-2.png",
            heroImageURL: "https://imgproxy-us-east-2-new.icons8.com/PAUm6GLujo2Ouq0Hb41Ewf_v2CG_2nqcszeNzpyjmqU/rs:fit:256:371/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMTMx/LzI3N2UxM2M4LTA1/ZTMtNDdlNS04OWJl/LTVjZmJjNzZiNDgy/ZC5zdmc.png",
            articles: [
                {
                    articleImageURL: "https://api.lorem.space/image/watch?w=150&h=150",
                    articleName: "Watch 1",
                    articleDescription: "lorem ipsum dolor sit amet",
                },
                {
                    articleImageURL: "https://api.lorem.space/image/watch?w=150&h=150",
                    articleName: "Watch 2",
                    articleDescription: "lorem ipsum dolor sit amet"
                },
                {
                    articleImageURL: "https://api.lorem.space/image/watch?w=150&h=150",
                    articleName: "Watch 3",
                    articleDescription: "lorem ipsum dolor sit amet"
                },
            ]
        },
    });
};

sendTemplatedEmail();