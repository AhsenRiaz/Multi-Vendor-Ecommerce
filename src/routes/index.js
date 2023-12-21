import { Router } from "express";
import authRoute from "./authRoute.js";

const router = new Router();

router.use("/auth", authRoute);

export default router;
