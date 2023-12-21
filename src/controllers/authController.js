import APIError from "../utils/apiError.js";
import User from "../models/user.js";
import httpStatus from "http-status";
import { uploadImage } from "../utils/cloudinary.js";
import tokenService from "../services/tokenService.js";
import Token from "../models/token.js";
import config from "../config/config.js";
import emailService from "../services/emailService/index.js";

// Sign Up
export const signup = async (req, res) => {
  const { name, email, password, avatar } = req.body;
  if (await User.findOne({ email })) {
    throw new APIError("User already exists", httpStatus.BAD_REQUEST);
  }
  const image = await uploadImage(avatar);

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: image.public_id,
      url: image.secure_url,
    },
  });
  const tokens = await tokenService.generateAuthTokens(user);
  return res.json({
    success: true,
    data: tokens,
  });
};

// Sign In
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new APIError("User not exists", httpStatus.BAD_REQUEST);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new APIError("Incorrect Password", httpStatus.BAD_REQUEST);
  }

  const tokens = await tokenService.generateAuthTokens(user);
  return res.json({
    success: true,
    data: tokens,
  });
};

// Sign Out
export const signout = async (req, res) => {
  const token = await Token.findOne({
    token: req.body.refreshToken,
    type: config.TOKEN_TYPES.REFRESH,
  });

  await token.deleteOne();
  return res.json({
    success: true,
    data: "Signout success",
  });
};

// Send Verification Email
export const sendVerificationEmail = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (user.confirmed) {
    throw new APIError("Email already verified", httpStatus.BAD_REQUEST);
  }
  const token = await tokenService.generateEmailVerificationToken(user);
  await emailService.sendResetPasswordEmail(req.user.email, token);

  return res.json({
    success: true,
    data: "Send verification email success",
  });
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const verifyEmailTokenDoc = await tokenService.verifyToken(
    req.query.token,
    config.TOKEN_TYPES.VERIFY_EMAIL
  );

  const user = await User.findById({ _id: verifyEmailTokenDoc.user });
  if (!user) {
    throw new Error();
  }

  await Token.deleteMany({
    user: user.id,
    type: config.TOKEN_TYPES.VERIFY_EMAIL,
  });

  user.confirmed = true;
  await user.save();

  return res.json({
    success: true,
    data: "Verify email success",
  });
};

export const forgotPassword = async (req, res) => {
  console.log("ran", req.body);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  console.log(resetPasswordToken);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return res.json({
    success: true,
    data: "Send forgot password email success",
  });
};

// Reset password
export const resetPassword = async (req, res) => {
  const resetPasswordToken = await tokenService.verifyToken(
    req.query.token,
    config.TOKEN_TYPES.RESET_PASSWORD
  );
  const user = await User.findById({ _id: resetPasswordToken.user });
  if (!user) {
    throw new Error("No User exist");
  }

  await Token.deleteMany({
    user: user.id,
    type: config.TOKEN_TYPES.RESET_PASSWORD,
  });

  user.password = req.body.password;
  await user.save();
  return res.json({
    success: true,
    data: "Reset password success",
  });
};

export const refreshTokens = async (req, res) => {
  const refreshTokenDoc = await tokenService.verifyToken(
    req.body.refreshToken,
    config.TOKEN_TYPES.REFRESH
  );

  const user = await User.findById({_id: refreshTokenDoc.user});

  if (!user) {
    throw new Error();
  }

  await refreshTokenDoc.deleteOne();

  const tokens = await tokenService.generateAuthTokens(user);

  return res.json({
    success: true,
    data: {
      tokens,
    },
  });
};

export default {
  signup,
  signin,
  signout,
  sendVerificationEmail,
  verifyEmail,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
