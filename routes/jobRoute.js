const express = require("express");
const { findById } = require("../model/jobModel.js");
const Job = require("../model/jobModel.js");
const Candidate = require("../model/candidateModel.js");
const Recruiter = require("../model/recruiterModel.js");
const router = express.Router();
var { authorizedUser } = require("../middleware/Authorization.js");

////// authorizedUser ////// To Authenticate the user with JWT token

//  Post the job by Recruiter
router.post("/postjob", authorizedUser, async (req, res) => {
  console.log(req.body);
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    res.status(200).send(savedJob);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

//  Get all job to display to the user

router.get("/getalljob", authorizedUser, async (req, res) => {
  try {
    const allPost = await Job.find();

    res.status(200).send(allPost);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

//  Get only the job which is posted by respective Recruiter by Recruiter ID

router.get("/getrecruiterpost/:id", authorizedUser, async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const recruiterPost = await Job.find({ postedby: id });

    res.status(200).send(recruiterPost);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Get job By it ID to update the JobDetail

router.get("/getjob/:id", authorizedUser, async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const getPostedJob = await Job.findOne({ _id: id });

    res.status(200).send(getPostedJob);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Delete the Job by it ID

router.delete("/delete/:id", authorizedUser, async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const deletePostedJob = await Job.findOneAndDelete({ _id: id });

    res.status(200).send(deletePostedJob);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Update the Job by it ID

router.put("/updatejob/:id", authorizedUser, async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const { id } = req.params;

  try {
    const updatePostedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).send(updatePostedJob);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// one Update the JobDetail by Candidate detail who Apply for that job
// two update Candidate collection by job id to which they applied

router.post("/apply/:id1/:id2", authorizedUser, async (req, res) => {
  console.log(req.params);
  const { id1, id2 } = req.params;
  try {
    const updatePostedJob = await Candidate.findOne(
      { _id: id2 },
      function (error, user) {
        if (error) return res.status(500).json(error);
        if (!user) return res.status(500).json({ msg: "no user available" });

        // console.log(user);
        if (user.jobApplied.includes(id1)) {
          // return res.status(200).send(user);
        } else {
          user.jobApplied.push(id1);
          user.save();
          // return res.status(200).send(user);
        }
      }
    ).clone();
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
  try {
    const updatePostedJob = await Job.findOne(
      { _id: id1 },
      function (error, job) {
        if (error) return res.status(500).json(error);
        if (!job) return res.status(500).json({ msg: "no job available" });

        // console.log(user);
        if (job.appliedby.includes(id2)) {
          return res.status(200).send(job);
        } else {
          job.appliedby.push(id2);
          job.save();
          return res.status(200).send(job);
        }
      }
    ).clone();
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
