import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    certificateName: {
      type: String,
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
    },
    issuedBy: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    documentFile: {
      type: String,
      requierd: true,
    },
    address: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    feePerConsultation: {
      type: Number,
      required: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    applicationStatus: {
      type: String,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
