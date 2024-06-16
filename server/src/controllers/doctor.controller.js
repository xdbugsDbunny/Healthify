import { Appointment } from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDoctorById = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.body.userId,
    });
    console.log(doctor);
    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Doctor Dara Fetched Successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const getDoctorByDoctorId = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.body.doctorId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Doctor Dara Fetched Successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body?.userId },
      { ...req.body },
      { new: true }
    );

    console.log(req.body?.userId);
    console.log("Requested Data", req.body);
    console.log(doctor);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Doctor Data Updated Successfully"));
  } catch (error) {
    throw new ApiError(400, `Something went wrong   :   ${error}`);
  }
});

const getAllAppointmentsByDoctorId = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const appointments = await Appointment.find({
      doctorId: doctor._id,
    });
    // console.log(doctor);
    return res
      .status(200)
      .json(
        new ApiResponse(200, appointments, "Doctor Data Fetched Successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const changeAppointmentStatus = asyncHandler(async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } // Return the updated document
    );

    const user = await User.findById(appointment.userId);

    let notificationMessage = `Your Appointment is ${status}`;

    user.unseenNotifications.push({
      type: "appointment-status-changed",
      message: notificationMessage,
      onClickPath: "/appointments",
    });

    await user.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, {}, "Apppointment Status Updated successfully")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export {
  getDoctorById,
  updateDoctorProfile,
  getDoctorByDoctorId,
  getAllAppointmentsByDoctorId,
  changeAppointmentStatus,
};
