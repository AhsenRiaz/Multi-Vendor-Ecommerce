import Joi from "joi";
import { mongoId } from "./customValidation.js";

export const getUserById = {
  body: Joi.object().keys({
    id: Joi.string().custom(mongoId).required(),
  }),
};

export const updateUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
  }),
};

export const deleteUserAddress = {
  body: Joi.object().keys({
    id: Joi.string().custom(mongoId),
  }),
};

export const updateUserPassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).max(666).required(),
    newPassword: Joi.string().min(6).max(666).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

export const deleteUser = {
  body: Joi.object().keys({
    deleteUserId: Joi.string().custom(mongoId),
  }),
};

export default {
  getUserById,
  updateUser,
  deleteUserAddress,
  updateUserPassword,
  deleteUser,
};
