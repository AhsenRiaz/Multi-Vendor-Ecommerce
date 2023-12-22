import { Router } from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import shopRoute from "./shopRoute.js";


const router = new Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/shop", shopRoute)

export default router;
