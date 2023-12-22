import passport from "passport";
import httpStatus from "http-status";
import APIError from "../utils/apiError.js";
import User from "../models/user.js";

const verifyCallback =
  (req, resolve, reject, requiredRole) => async (err, user, info) => {
    console.log("user", user);
    if (err || info || !user) {
      return reject(
        new APIError(
          httpStatus[httpStatus.UNAUTHORIZED],
          httpStatus.UNAUTHORIZED
        )
      );
    }
    req.user = user;
    if (requiredRole && !(requiredRole === user.role)) {
      return reject(
        new APIError("Resource access denied", httpStatus.FORBIDDEN)
      );
    }
    return resolve();
  };

// check which function gets invoked
const authenticate = (requiredRole) => async (req, res, next) => {
  console.log("requiredRole", requiredRole);
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, requiredRole)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default authenticate;
