import { Router } from "express";
import catchAsync from "../middlewares/catchAsync.js";
import validate from "../middlewares/validate.js";
import shopValidation from "../validations/shopValidation.js";
import shopController from "../controllers/shopController.js";
import authenticate from "../middlewares/authenticate.js";

const router = new Router();

router.post(
  "/create-shop",
  validate(shopValidation.createShop),
  catchAsync(shopController.createShop)
);

router.post(
  "/signin-shop",
  validate(shopValidation.signInShop),
  catchAsync(shopController.signInShop)
);

router.get(
  "/get-shop",
  authenticate("Seller"),
  catchAsync(shopController.getShop)
);

router.post(
  "/signout-shop",
  validate(shopValidation.signOutShop),
  catchAsync(shopController.signOutShop)
);

router.get("/get-shop-by-id", catchAsync(shopController.getShopById));

router.put(
  "/update-shop-info",
  authenticate("Seller"),
  validate(shopValidation.updateShopInfo),
  catchAsync(shopController.updateShopInfo)
);

router.put(
  "/update-shop-password",
  authenticate("Seller"),
  validate(shopValidation.updateShopPassword),
  catchAsync(shopController.updateShopPassword)
);

router.get(
  "/get-all-shops",
  authenticate("Admin"),
  catchAsync(shopController.getShop)
);

router.delete(
  "delete-shop",
  authenticate("Admin"),
  catchAsync(shopController.deleteShop)
);

router.put(
  "/update-payment-method",
  authenticate("Seller"),
  catchAsync(shopController.updatePaymentMethod)
);

router.delete(
  "/delete-payment-method",
  authenticate("Seller"),
  catchAsync(shopController.deletePaymentMethod)
);

router.get("/get-user", authenticate(), catchAsync(shopController.getUser));

router.get(
  "/get-user-by-id",
  validate(shopController.getUserById),
  catchAsync(shopController.getUserById)
);

router.put(
  "/update-user-info",
  authenticate(),
  validate(shopController.updateUser),
  catchAsync(shopController.updateUser)
);

router.delete(
  "/delete-user-address",
  authenticate(),
  validate(shopController.deleteUserAddress),
  catchAsync(shopController.deleteUserAddress)
);

router.put(
  "/update-user-password",
  authenticate(),
  validate(shopController.updateUserPassword),
  catchAsync(shopController.updateUserPassword)
);

// implement admin role for below routes
router.get(
  "/get-all-users",
  authenticate("Admin"),
  catchAsync(shopController.getAllUsers)
);

router.delete(
  "/delete-user-by-id",
  authenticate("Admin"),
  validate(shopController.deleteUser),
  catchAsync(shopController.deleteUser)
);

export default router;
