import APIError from "../utils/apiError.js";
import Shop from "../models/shop.js";
import httpStatus from "http-status";
import { uploadImage } from "../utils/cloudinary.js";
import tokenService from "../services/tokenService.js";
import Token from "../models/token.js";
import config from "../config/config.js";

export const createShop = async (req, res) => {
  const { email, avatar, name, password, address, phoneNumber, zipCode } =
    req.body;

  if (await Shop.findOne({ email })) {
    throw new APIError("Shop already exists", httpStatus.BAD_REQUEST);
  }

  const image = await uploadImage(avatar);

  const user = await Shop.create({
    name,
    email,
    password,
    role: "Seller",
    avatar: {
      public_id: image.public_id,
      url: image.secure_url,
    },
    address,
    phoneNumber,
    zipCode,
  });
  const tokens = await tokenService.generateAuthTokens(user, "Seller");
  return res.json({
    success: true,
    data: tokens,
  });
};

export const signInShop = async (req, res) => {
  const { email, password } = req.body;

  const user = await Shop.findOne({ email }).select("+password");

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

export const getShop = async (req, res) => {
  const shop = await Shop.findById(req.user.id);
  if (!shop) {
    throw new APIError("Shop not exist", httpStatus.BAD_REQUEST);
  }
  return res.json({
    success: true,
    data: shop,
  });
};

export const signOutShop = async (req, res) => {
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

export const getShopById = async (req, res) => {
  const shopId = req.body.id;
  let shop = await Shop.findById({ _id: shopId });
  if (!shop) {
    throw new APIError("Shop not exist", httpStatus.BAD_REQUEST);
  }

  return res.json({
    success: true,
    data: shop,
  });
};

export const updateShopInfo = async (req, res) => {
  const { email, phoneNo } = req.body;
  const shop = await Shop.findById(req.user.id);
  if (!shop) {
    throw new APIError("Shop not exist", httpStatus.BAD_REQUEST);
  }

  if (await Shop.findOne({ email, _id: { $ne: req.user.id } })) {
    throw new APIError("Email already exist", httpStatus.BAD_REQUEST);
  }
  if (await Shop.findOne({ phoneNo, _id: { $ne: req.user.id } })) {
    throw new APIError("Email already exist", httpStatus.BAD_REQUEST);
  }
  Object.assign(shop, req.body);

  await shop.save();

  return res.json({
    success: true,
    data: shop,
  });
};

export const updateShopPassword = async (req, res) => {
  const shopId = req.user.id;
  let shop = await Shop.findById({ _id: shopId }).select("+password");

  const isPasswordMatch = await shop.comparePassword(req.body.oldPassword);
  if (!isPasswordMatch) {
    throw new APIError("Password incorrect", httpStatus.UNAUTHORIZED);
  }

  shop.password = req.body.newPassword;
  await shop.save();

  return res.json({
    success: true,
    data: "Password updated success",
  });
};

export const getAllShops = async (req, res) => {
  const shops = await Shop.find().sort({
    createdAt: -1,
  });

  return res.json({
    success: true,
    data: shops,
  });
};

export const deleteShop = async (req, res) => {
  const { deleteShopId } = req.body;
  const shop = await Shop.findById({ _id: deleteShopId });
  if (!shop) {
    throw new APIError("Shop not exist", httpStatus.BAD_REQUEST);
  }

  await deleteImage(shop.avatar.public_id);
  await shop.deleteOne();

  return res.json({
    success: true,
    data: "Shop delete success",
  });
};

export const updatePaymentMethod = async (req, res) => {
  const { paymentMethod } = req.body;

  const seller = await Shop.findByIdAndUpdate(
    { _id: req.user.id },
    {
      paymentMethod,
    }
  );

  return res.json({
    success: true,
    data: seller,
  });
};

export const deletePaymentMethod = async (req, res) => {
  const seller = await Shop.findById({ _id: req.user.id });

  if (!seller) {
    throw new APIError("Seller not exist", httpStatus.BAD_REQUEST);
  }

  seller.withdrawMethod = null;

  await seller.save();
  return res.json({
    success: true,
    data: "Delete payment method success",
  });
};

export default {
  createShop,
  signInShop,
  getShop,
  signOutShop,
  getShopById,
  updateShopInfo,
  getAllShops,
  deleteShop,
  updatePaymentMethod,
  deletePaymentMethod,
  updateShopPassword,
};
