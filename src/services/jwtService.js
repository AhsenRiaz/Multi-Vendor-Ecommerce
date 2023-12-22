import moment from "moment";
import APIError from "../utils/apiError.js";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export const sign = async (userId, expires, secret, options, type) => {
  try {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };

    return jwt.sign(payload, secret, options);
  } catch (err) {
    throw new APIError(err.message, httpStatus.UNAUTHORIZED);
  }
};

export default {sign}
