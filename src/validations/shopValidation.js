import Joi from "joi";
import { mongoId } from "./customValidation.js";

export const createShop = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(666).required(),
    avatar: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    zipCode: Joi.string().required(),
  }),
};

export const signInShop = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const signOutShop = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const getShopById = {
  body: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

export const updateShopInfo = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(20).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    phoneNo: Joi.string().required(),
    zipCode: Joi.string().required(),
  }),
};

export const updateShopPassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).max(666).required(),
    newPassword: Joi.string().min(6).max(666).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

export const deleteShop = {
  body: Joi.object().keys({
    deleteShopId: Joi.string().custom(mongoId),
  }),
};

export const updatePaymentMethod = {
  body: Joi.object().keys({
    paymentMethod: Joi.object(),
  }),
};

export const deletePaymentMethod = {
  body: Joi.object().keys({
    paymentMethod: Joi.object(),
  }),
};

export default {
  deletePaymentMethod,
  updatePaymentMethod,
  deleteShop,
  updateShopPassword,
  updateShopInfo,
  getShopById,
  signOutShop,
  signInShop,
  createShop,
};
