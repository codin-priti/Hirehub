
import mongoose from "mongoose";
import Job from "../models/jobModal.js";

// Validate the ID and find the job
export const loadJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const jobPosting = await Job.findById(jobId);

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Store the job for the next middleware/controller
    req.job = jobPosting;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// Check whether the logged-in recruiter owns the job
export const requireJobOwner = (req, res, next) => {
  if (String(req.job.recruiter) !== String(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to manage this job",
    });
  }

  next();
};
