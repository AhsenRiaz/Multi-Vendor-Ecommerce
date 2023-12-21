import nodemailer from "nodemailer";
import logger from "../../config/logger.js";
import config from "../../config/config.js";
import template from "./template.js";

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5995789dededae",
    pass: "4f1c3f9498fc7f",
  },
});

if (config.NODE_ENV !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() => logger.warn("Unable to connect to email server"));
}

const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };
    await transport.sendMail(msg);
  } catch (error) {
    throw new Error("email not sent");
  }
};

export const sendVerificationEmail = async (to, token) => {
  const subject = "Verify Email";
  const verificationEmailUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
  const html = template.verifyEmail(verificationEmailUrl, config.APP_NAME);
  await sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset Password";
  const verificationEmailUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
  const html = template.resetPassword(verificationEmailUrl, config.APP_NAME);
  await sendEmail(to, subject, html);
};

export default {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
