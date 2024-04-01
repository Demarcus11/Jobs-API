import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId, // Everytime we create a Job it will be assigned to a user
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export const model = mongoose.model("Job", JobSchema);
