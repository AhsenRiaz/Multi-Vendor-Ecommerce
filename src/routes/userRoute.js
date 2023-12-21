import { Router } from "express";
import catchAsync from "../middlewares/catchAsync.js";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/userValidation.js";
import userController from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";

const router = new Router();


// implement validation on below routes
router.get("/get-user", authenticate(), catchAsync(userController.getUser()));

router.get("get-user-by-id", catchAsync(userController.getUserById()));

router.put(
  "/update-user-info",
  authenticate(),
  catchAsync(userController.updateUser())
);

router.delete(
  "/delete-user-address",
  authenticate(),
  catchAsync(userController.deleteUserAddress())
);

router.put(
  "/update-user-password",
  authenticate(),
  catchAsync(userController.updateUserPassword())
);

// implement admin role for below routes
router.get(
  "/get-all-users",
  authenticate(),
  catchAsync(userController.getAllUsers())
);

router.delete(
  "/delere-user-by-id",
  authenticate(),
  catchAsync(userController.deleteUser())
);
