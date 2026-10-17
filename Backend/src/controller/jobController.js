import mongoose from 'mongoose';
import job from '../models/jobModal';


//Create a job posting

export const createJobPosting = async (req, res) => {
  try {
    const { title, description, location, salary, company, jobType, isPublic, joiningDate } = req.body;

    const newJob = await job.create({
      title,
      description,
      location,
      salary,
      company,
      jobType,
      isPublic,
      joiningDate
    });

    await newJob.save();

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      job: newJob
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating job posting.',
      error: error.message
    });
  };
}

//list recruiters job

export const listRecruiterJobs = async (req, res) => {
  try {
    const jobs = await job.find({ recruiter: req.user.id }).populate('company', 'name location industry');
    return res.status(200).json({
      success: true,
      message: 'Jobs listed successfully.',
      jobs: jobs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error listing jobs.',
      error: error.message
    });
  }
}



export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find job and populate related details
    const job = await job.findById(jobId)
      .populate("recruiter", "name email")
      .populate("company", "name logo industry");

    // Check whether job exists
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
    });
  }
};

//publish a job

export const publishJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job "
      })
    }

    const job = await job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      })
    }

    //check job ownership
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        sucess: false,
        message: " You are not authorize to publish this job "
      })
    }

    //prevent  closed job

    if (job.status === "closed") {
      return res.status(400).json({
        sucess: false,
        message: "A closed job cannot be published"
      })
    }

    job.status = "published";
    await job.save();

    return res.status(200).json({
      success: true,
      message: "job published",
      job,
    })
  }
  catch (error) {
    console.error("Public job error", error)

    return res.status(500).json({
      sucess: false,
      message: "failed to publish"
    })
  }
}

//pause the application

export const pauseApplication = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Validate the job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // 2. Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3. Check ownership
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pause this job",
      });
    }

    // 4. Pause the job
    job.status = "paused";
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job paused successfully",
      job,
    });
  } catch (error) {
    console.error("Pause job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to pause job",
    });
  }
};




