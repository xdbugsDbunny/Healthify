import { Appointment } from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import moment from "moment";

const options = {
  httpOnly: true, // Prevents JavaScript access to cookies
  // secure: process.env.NODE_ENV === 'production',  // Ensures cookies are only sent over HTTPS in production
  secure: true,
  sameSite: "strict", // Prevents CSRF attacks
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, phone, password, dob } = req.body;

    if (
      ![name, email, phone, password, dob].every(
        (field) => field && field.trim() !== ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existedUser) {
      throw new ApiError(409, "User with email or phone number already exists");
    }

    if (!req.file || !req.file.path) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(req.file.path);
    if (!avatar || !avatar.url) {
      throw new ApiError(400, "Error uploading avatar file");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      dob,
      avatar: avatar.url,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Error while registering user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    // console.error("Registration error:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error"));
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Input validation
    if (!emailOrPhone || !password) {
      throw new ApiError(400, "Email/Phone and password are required");
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);

    let user;

    if (isEmail) {
      user = await User.findOne({ email: emailOrPhone });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      throw new ApiError(404, "User Does Not Exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Fetch user data excluding sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Set cookies and send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged In Successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error"));
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out"));
  } catch (error) {
    throw new ApiError(401, "Something Went Wrong");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, {}, "Authenticated"));
  } else {
    throw new ApiError(401, "Not authenticated");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(200, req.user, "Working"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const applyDoctor = asyncHandler(async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      specialization,
      certificateName,
      certificateNumber,
      issuedBy,
      issueDate,
      address,
      experience,
      feePerConsultation,
      timings,
    } = req.body;

    const existedUser = await Doctor.findOne({ userId });
    // console.log(existedUser);

    if (existedUser) {
      const { applicationStatus } = existedUser;
      if (
        applicationStatus === "VERIFYING" ||
        applicationStatus === "PENDING" ||
        applicationStatus === "REJECTED" ||
        applicationStatus === "APPROVED" ||
        applicationStatus === "BLOCKED"
      ) {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              null,
              `You Can not re-apply for Doctor. Your application status is ${applicationStatus}`,
              false
            )
          );
      }
    }

    if (!req.file || !req.file.path) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "Please Provide A Certificate", false)
        );
    }

    const documentFile = await uploadOnCloudinary(req.file.path);
    if (!documentFile || !documentFile.url) {
      throw new ApiError(400, "Error uploading avatar file");
    }

    const formattedIssuedDate = issueDate.split("T")[0];

    const newDoctor = new Doctor({
      userId,
      firstName,
      lastName,
      specialization,
      address,
      experience,
      feePerConsultation,
      timings,
      certificateName,
      certificateNumber,
      issuedBy,
      issueDate: formattedIssuedDate,
      documentFile: documentFile.url,
      applicationStatus: "PENDING",
    });

    await newDoctor.save();

    // Update admin notifications
    const adminUser = await User.findOne({ isAdmin: true });

    if (adminUser) {
      const unseenNotifications = adminUser.unseenNotifications || [];
      unseenNotifications.push({
        type: "new-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for Doctor Account`,
        data: {
          doctorId: newDoctor._id,
          name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        },
        onClickPath: "/admin/list-of-doctors",
      });
      await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          req.user,
          "Doctor application submitted successfully"
        )
      );
  } catch (error) {
    // console.error(error);
    throw new ApiError(400, error.message, "Something went wrong");
  }
});

const markAllNotificationsAsSeen = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    // const updatedUser = await User.findByIdAndUpdate(user._id, user).select(
    //   "-password -refreshToken"
    // );
    await user.save();
    const updatedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "All Notifications Marked As Seen",
          true
        )
      );
  } catch (error) {
    // console.error(error);
    throw new ApiError(400, error.message, "Something went wrong");
  }
});

const deleteAllNotifications = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    // user.unseenNotifications = [];
    // const updatedUser = await User.findByIdAndUpdate(user._id, user).select(
    //   "-password -refreshToken"
    // );
    await user.save();
    const updatedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "All Notifications Are Deleted", true)
      );
  } catch (error) {
    // console.error(error);
    throw new ApiError(400, error.message, "Something went wrong");
  }
});

const getAllApprovedDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({
      applicationStatus: "APPROVED",
    });

    const doctorDetails = await Promise.all(
      doctors.map(async (doctor) => {
        const user = await User.findById(doctor.userId, "phone email");
        return {
          ...doctor.toObject(),
          phone: user.phone,
          email: user.email,
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, doctorDetails, "Doctor Data Fetched Successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const bookAppointment = asyncHandler(async (req, res) => {
  try {
    // console.log("1");
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.selectedTime = moment(
      req.body.selectedTime,
      "HH:mm"
    ).toISOString();

    const newAppointment = new Appointment(req.body);
    // console.log("2");

    await newAppointment.save();

    const user = await User.findOne({ _id: req.body.doctorInfo.userId });

    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A New Appointment Request has been made by ${newAppointment?.userInfo?.name}`,
      onClickPath: "/doctor/appointments",
    });

    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Appointment Booked Successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong", error);
  }
});

const checkAvailability = asyncHandler(async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.selectedTime, "HH:mm")
      .subtract(30, "minutes") // Adjusting the time range to 30 minutes before the selected time
      .toISOString();
    const toTime = moment(req.body.selectedTime, "HH:mm")
      .add(30, "minutes") // Adjusting the time range to 30 minutes after the selected time
      .toISOString();

    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      selectedTime: { $gte: fromTime, $lte: toTime },
      // status: "APPROVED",
    });

    if (appointments.length > 0) {
      return res
        .status(200)
        .send({ success: false, message: `This Slot is Booked Already` });
    } else {
      return res.status(200).send({
        success: true,
        message: "Slot Available",
        // appointments,
        // fromTime,
        // toTime,
      });
    }
  } catch (error) {
    throw new ApiError(400, "Something went wrong", error);
  }
});

const getAllAppointmentsByUserId = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, appointments, "Doctor Data Fetched Successfully"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  checkAuth,
  applyDoctor,
  markAllNotificationsAsSeen,
  deleteAllNotifications,
  getAllApprovedDoctors,
  bookAppointment,
  checkAvailability,
  getAllAppointmentsByUserId,
};
