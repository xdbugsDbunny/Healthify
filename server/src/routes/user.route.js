import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  bookAppointment,
  checkAuth,
  checkAvailability,
  deleteAllNotifications,
  getAllAppointmentsByUserId,
  getAllApprovedDoctors,
  getUserById,
  loginUser,
  logoutUser,
  markAllNotificationsAsSeen,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { applyDoctor } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router
  .route("/apply-doctor")
  .post(verifyJWT, upload.single("documentFile"), applyDoctor);
router
  .route("/mark-notifications-all-as-seen")
  .post(verifyJWT, markAllNotificationsAsSeen);
router
  .route("/delete-all-notifications")
  .post(verifyJWT, deleteAllNotifications);

router.route("/login").post(loginUser);

//secured Routes if user is logged in

router.route("/logout").post(verifyJWT, logoutUser);

router.post("/check-auth", verifyJWT, checkAuth);

router.route("/getUserById").post(verifyJWT, getUserById);

router.route("/get-all-approved-doctors").get(verifyJWT, getAllApprovedDoctors);
router.route("/get-all-appointments-by-user-id").post(verifyJWT, getAllAppointmentsByUserId);

router.route("/book-appointment").post(verifyJWT, bookAppointment);

router
  .route("/check-appointment-availability")
  .post(verifyJWT, checkAvailability);

export default router;
