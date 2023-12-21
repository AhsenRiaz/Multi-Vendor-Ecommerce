import passport from "passport";
import httpStatus from "http-status";
import APIError from "../utils/apiError.js";

const verifyCallBack = (req, resolve, reject) => {
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new APIError(
          httpStatus[httpStatus.UNAUTHORIZED],
          httpStatus.UNAUTHORIZED
        )
      );
    }
    req.user = user;
    return resolve();
  };
};

// check which function gets invoked
const authenticate = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallBack(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default authenticate;
