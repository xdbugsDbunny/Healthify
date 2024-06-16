import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    changeAppointmentStatus,
  getAllAppointmentsByDoctorId,
  getDoctorByDoctorId,
  getDoctorById,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";

const router = Router();

router.route("/get-doctor-by-id").post(verifyJWT, getDoctorById);
router.route("/get-doctor-by-doctor-id").post(verifyJWT, getDoctorByDoctorId);
router.route("/update-doctor-profile").post(verifyJWT, updateDoctorProfile);
router
  .route("/get-all-appointments-by-doctor-id")
  .get(verifyJWT, getAllAppointmentsByDoctorId);

  router.route("/change-appointment-status").post(verifyJWT, changeAppointmentStatus);

export default router;
