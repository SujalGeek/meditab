import asynchandler from "./asyncHandler.js";
import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});
export const sendNotification = asynchandler(
  async (recipient, subject, message) => {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "22dce001@charusat.edu.in",
            Name: "Hospital Admin",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: subject,
          TextPart: message,
        },
      ],
    });
    try {
      await request;
    } catch (error) {
      console.error("Error sending email", error);
      throw new ApiError(500, "Failed to send email notification");
    }
  },
);
