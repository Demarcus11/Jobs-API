import express from "express";
import { getAllJobs, getJob, createJob, updateJob, deleteJob } from "../controllers/jobs.js";

// Initialize router
export const router = express.Router();

// Routes
router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob);
