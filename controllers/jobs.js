import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/bad-request.js";
import { NotFoundError } from "../errors/not-found.js";
import { model as Job } from "../models/Job.js";

// Get all jobs for logged in user and send response back to frontend
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt"); // only get the jobs by the user that's logged in
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// Get userId and jobId from the request, find the job, send response back to frontend
export const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json(job);
};

// Add a property 'createdBy' on the request body, create a job with the request body, send response back to frontend
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId; // since we created a 'user' property on the req when we authenticated the user (we placed the auth middleware infront of the jobs router in server.js so all of these controllers have req.user), when a job is created the createdBy field will have the user that's logged in, that way in the jobs collection in the DB each job will have a 'createdBy' property which is the user who job that belongs to
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

// Get the company, position, userId, and jobId from the request, validate company and position, find and update job, send only status code to frontend
export const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Please enter a company name and position");
  }

  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

// Get the userId and jobId from the request, find and delete job, send only status code to frontend
export const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};
