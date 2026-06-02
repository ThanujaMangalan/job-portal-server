const Application = require("../Models/applicationModel");
const Job = require("../Models/JobModel");

exports.applyToJob = async (req, res) => {
  const { id: jobId } = req.params;
  const applicantId = req.userId;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existing) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
    });

    const populated = await Application.findById(application._id)
      .populate({ path: "job", populate: { path: "company" } });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkApplicationStatus = async (req, res) => {
  const { id: jobId } = req.params;
  try {
    const application = await Application.findOne({
      job: jobId,
      applicant: req.userId,
    });
    res.status(200).json({ applied: !!application, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecruiterApplications = async (req, res) => {
  try {
    const recruiterJobs = await Job.find({ created_by: req.userId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate({ path: "job", populate: { path: "company" } })
      .populate("applicant", "fullname email phoneNumber profile")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.created_by.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
