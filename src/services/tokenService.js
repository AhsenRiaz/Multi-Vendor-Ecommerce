import moment from "moment";
import config from "../config/config.js";
import crypto from "crypto";
import jwtService from "../services/jwtService.js";
import Token from "../models/token.js";
import User from "../models/user.js";
import APIError from "../utils/apiError.js";
import httpStatus from "http-status";

export const generateRandomToken = async (length = 66) => {
  const random = crypto.randomBytes(length).toString("hex");
  return random;
};

export const verifyToken = async (token, type) => {
  const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
  if (!tokenDoc) {
    throw new APIError("Token not found", httpStatus.UNAUTHORIZED);
  }

  if (moment(tokenDoc.expiresAt).format() < moment().format()) {
    throw new APIError("Token has expired", httpStatus.UNAUTHORIZED);
  }
  return tokenDoc;
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
    "minutes"
  );

  const accessToken = await jwtService.sign(
    user.id,
    accessTokenExpires,
    config.JWT_SECRET,
    {
      algorithm: "HS256",
    }
  );

  const refreshTokenExpires = moment().add(
    config.REFRESH_TOKEN_EXPIRATION_DAYS,
    "days"
  );
  const refreshToken = await generateRandomToken();

  await Token.create({
    user: user.id,
    type: config.TOKEN_TYPES.REFRESH,
    expiresAt: refreshTokenExpires,
    blacklisted: false,
    token: refreshToken,
  });

  return {
    accessToken: {
      token: accessToken,
      expires: accessTokenExpires.format(),
    },
    refreshToken: {
      token: refreshToken,
      expires: refreshTokenExpires.format(),
    },
  };
};

export const generateEmailVerificationToken = async (user) => {
  const emailVerificationTokenExpire = moment().add(
    config.VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES,
    "minutes"
  );
  const emailVerificationToken = await generateRandomToken();

  await Token.create({
    user: user.id,
    type: config.TOKEN_TYPES.VERIFY_EMAIL,
    expiresAt: emailVerificationTokenExpire,
    blacklisted: false,
    token: emailVerificationToken,
  });

  return emailVerificationToken;
};

export const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("No users found with this email", httpStatus.NOT_FOUND);
  }
  const forgotPasswordTokenExpiration = moment().add(
    config.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES,
    "minutes"
  );
  const forgotPasswordToken = await generateRandomToken();

  await Token.create({
    user: user.id,
    type: config.TOKEN_TYPES.RESET_PASSWORD,
    expiresAt: forgotPasswordTokenExpiration,
    blacklisted: false,
    token: forgotPasswordToken,
  });

  return forgotPasswordToken;
};

export default {
  generateAuthTokens,
  generateEmailVerificationToken,
  generateResetPasswordToken,
  verifyToken,
};
