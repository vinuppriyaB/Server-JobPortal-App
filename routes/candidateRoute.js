const express = require("express");
const Candidate = require("../model/candidateModel.js");
const Recruiter = require("../model/recruiterModel.js");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var { authorizedUser } = require("../middleware/Authorization.js");

////// authorizedUser ////// To Authenticate the user with JWT token

// Create account for Candidate

router.post("/register", async (req, res) => {
  // console.log(req.body);
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

    let { password, ...others } = savedUser._doc;
    res.status(200).send({ ...others, token });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Both candidate and recruiter Login where return token for Authentication
// first Check with Candidate collection ,if user not Available then
// Second check with Recruiter collection

router.post("/login", async (req, res) => {
  // console.log(req.body);
  const isCandidateExist = await Candidate.findOne({ email: req.body.email });
  if (isCandidateExist) {
    try {
      let user = await bcrypt.compare(
        req.body.password,
        isCandidateExist.password
      );
      console.log(user);
      if (!user) return res.status(400).send({ msg: "invalide Credential" });

      var token = await jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "3d",
        }
      );

      let { password, ...others } = isCandidateExist._doc;

      return res.status(200).send({ ...others, token });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  } else {
    const isRecruiterExist = await Recruiter.findOne({
      email: req.body.email,
    });
    if (!isRecruiterExist)
      return res.status(400).send({ msg: "invalide Credential" });
    try {
      let user = await bcrypt.compare(
        req.body.password,
        isRecruiterExist.password
      );
      if (!user) return res.status(400).send({ msg: "invalide Credential" });

      var token = await jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "3d",
        }
      );

      let { password, ...others } = isRecruiterExist._doc;

      return res.status(200).send({ ...others, token });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }
});

// To update Candidate Details

router.post("/update", authorizedUser, async (req, res) => {
  // console.log(req.body);
  try {
    const updateCandidate = await Candidate.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { new: true }
    );
    res.status(200).send(updateCandidate);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Get the Candidate who applied to particular job by jobId

router.get("/getCandidates/:id", authorizedUser, async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  let CandidateList = [];
  try {
    const result = await Candidate.find({}, function (error, user) {
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
