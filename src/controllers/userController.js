import APIError from "../utils/apiError.js";
import User from "../models/user.js";
import httpStatus from "http-status";
import { deleteImage } from "../utils/cloudinary.js";

export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new APIError("User not exist", httpStatus.BAD_REQUEST);
  }
  return res.json({
    success: true,
    user,
  });
};

export const updateUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new APIError("User not exist", httpStatus.BAD_REQUEST);
  }

  if (await User.findOne({ email, _id: { $ne: req.user.id } })) {
    throw new APIError("Email already exist", httpStatus.BAD_REQUEST);
  }
  Object.assign(user, req.body);

  await user.save();

  return res.json({
    success: true,
    data: user,
  });
};

export const deleteUserAddress = async (req, res) => {
  const userId = req.user.id;
  let user = await User.findById({ _id: userId });
  if (!user) {
    throw new APIError("User not exist", httpStatus.BAD_REQUEST);
  }
  const addressId = req.body.id;

  await User.updateOne(
    { _id: userId },
    {
      $pull: { addresses: { _id: addressId } },
    }
  );
  user = await User.findById({ _id: userId });
  return res.json({
    success: true,
    data: user,
  });
};

export const updateUserPassword = async (req, res) => {
  const userId = req.user.id;
  let user = await User.findById({ _id: userId }).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatch) {
    throw new APIError("Password incorrect", httpStatus.UNAUTHORIZED);
  }

  user.password = req.password;
  await user.save();

  return res.json({
    success: true,
    data: "Password updated success",
  });
};

export const getUserById = async (req, res) => {
  const userId = req.user.id;
  let user = await User.findById({ _id: userId });
  if (!user) {
    throw new APIError("User not exist", httpStatus.BAD_REQUEST);
  }

  return res.json({
    success: true,
    data: user,
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().sort({
    createdAt: -1,
  });

  return res.json({
    success: true,
    data: users,
  });
};

export const deleteUser = async (req, res) => {
  const { deleteUserId } = req.body;
  const user = await User.findById({ _id: deleteUserId });
  if (!user) {
    throw new APIError("User not exist", httpStatus.BAD_REQUEST);
  }

  await deleteImage(user.avatar.public_id);
  await user.deleteOne();

  return res.json({
    success: true,
    data: "User delete success",
  });
};

export default {
  getUser,
  getUserById,
  updateUser,
  deleteUserAddress,
  updateUserPassword,
  getAllUsers,
  deleteUser,
};
