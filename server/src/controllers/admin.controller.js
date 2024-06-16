import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    return res
      .status(201)
      .json(new ApiResponse(201, doctors, "Doctors Fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, error.message, "Something went wrong");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    return res
      .status(201)
      .json(new ApiResponse(201, users, "Users Fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, error.message, "Something went wrong");
  }
});

const changeApplicationStatus = asyncHandler(async (req, res) => {
  try {
    const { doctorId, applicationStatus, userId } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { applicationStatus },
      { new: true } // Return the updated document
    );

    const user = await User.findById(userId);

    let notificationMessage = `Your Doctor Account Application is ${applicationStatus}`;

    if (applicationStatus === "VERIFYING") {
      notificationMessage = "Your application is in verifying process";
    }

    user.unseenNotifications.push({
      type: "doctor-account-request-changed",
      message: notificationMessage,
      onClickPath: "/notifications",
    });

    user.isDoctor = applicationStatus === "APPROVED" ? true : false;
    await user.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, doctor, "Application Status updated successfully")
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

export { getAllDoctors, getAllUsers, changeApplicationStatus };
