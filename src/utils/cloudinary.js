import cloudinary from "cloudinary";
import config from "../config/config.js";

cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (avatar) => {
  try {
    const image = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    return image;
  } catch (error) {
    throw Error("Error uploading image");
  }
};

export const deleteImage = async (avatarId) => {
  try {
    await cloudinary.v2.uploader.destroy(avatarId);
  } catch (error) {
    throw Error("Error uploading image");
  }
};

export default cloudinary;
