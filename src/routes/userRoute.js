import { Router } from "express";
import catchAsync from "../middlewares/catchAsync.js";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/userValidation.js";
import userController from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";

const router = new Router();

// implement validation on below routes
router.get("/get-user", authenticate(), catchAsync(userController.getUser));

router.get(
  "/get-user-by-id",
  validate(userValidation.getUserById),
  catchAsync(userController.getUserById)
);

router.put(
  "/update-user-info",
  authenticate(),
  validate(userValidation.updateUser),
  catchAsync(userController.updateUser)
);

router.delete(
  "/delete-user-address",
  authenticate(),
  validate(userValidation.deleteUserAddress),
  catchAsync(userController.deleteUserAddress)
);

router.put(
  "/update-user-password",
  authenticate(),
  validate(userValidation.updateUserPassword),
  catchAsync(userController.updateUserPassword)
);

// implement admin role for below routes
router.get(
  "/get-all-users",
  authenticate("Admin"),
  catchAsync(userController.getAllUsers)
);

router.delete(
  "/delete-user-by-id",
  authenticate("Admin"),
  validate(userValidation.deleteUser),
  catchAsync(userController.deleteUser)
);

export default router;
