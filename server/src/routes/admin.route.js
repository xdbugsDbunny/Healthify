import { Router } from "express";
import { changeApplicationStatus, getAllDoctors, getAllUsers } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/list-of-users").get(verifyJWT, getAllUsers);

router.route("/list-of-doctors").get(verifyJWT, getAllDoctors);

router.route("/change-application-status").post(verifyJWT, changeApplicationStatus);

export default router;
