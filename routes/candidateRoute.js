const express = require("express");
const Candidate = require("../model/candidateModel.js");
const Recruiter = require("../model/recruiterModel.js");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
// var { authorizedUser } = require("../middleware/Authorrization.js");

router.post("/register", async (req, res) => {
  console.log(req.body);
  const isuserExist = await Candidate.findOne({ email: req.body.email });

  if (isuserExist) return res.status(400).json("account already exist");

  try {
    const salt = await bcrypt.genSalt(9);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUser = new Candidate(req.body);
    const savedUser = await newUser.save();

    var token = await jwt.sign(
      { email: req.body.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    let { _id, email, isCandidate, ...others } = savedUser._doc;
    res.status(200).send({ _id, email, isCandidate, token });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const isCandidateExist = await Candidate.findOne({ email: req.body.email });

  if (isCandidateExist) {
    var token = await jwt.sign(
      { email: req.body.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    let { password, ...others } = isCandidateExist._doc;

    return res.status(200).send({ ...others, token });
  }

  const isRecruiterExist = await Recruiter.findOne({ email: req.body.email });
  if (isRecruiterExist) {
    var token = await jwt.sign(
      { email: req.body.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    let { password, ...others } = isRecruiterExist._doc;

    return res.status(200).send({ ...others, token });
  }
});

router.post("/update", async (req, res) => {
  // console.log(req.body);
  const updateCandidate = await Candidate.findOneAndUpdate(
    { email: req.body.email },
    req.body,
    { new: true }
  );
  res.status(200).send(updateCandidate);
});
router.get("/getCandidates/:id", async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  let CandidateList = [];
  try {
    const updatePostedJob = await Candidate.find({}, function (error, user) {
      if (error) return res.status(500).json(error);
      if (!user) return res.status(500).json({ msg: "no job available" });

      // console.log(user);
      for (let i = 0; i < user.length; i++) {
        if (user[i].jobApplied.includes(id)) {
          CandidateList.push(user[i]);
          console.log(user[i]);
        }
      }
      res.status(200).send(CandidateList);
    }).clone();
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
