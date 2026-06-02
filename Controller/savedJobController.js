const User = require("../Models/userModel");
const Job = require("../Models/JobModel");

exports.saveJob = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(req.userId);
    if (user.savedJobs.includes(jobId)) {
      return res.status(409).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: "Job saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "savedJobs",
      populate: { path: "company" },
    });

    res.status(200).json(user?.savedJobs || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unsaveJob = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { savedJobs: jobId },
    });

    res.status(200).json({ message: "Job removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
