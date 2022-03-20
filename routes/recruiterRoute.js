const express = require("express");
const Recruiter = require("../model/recruiterModel.js");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var { authorizedUser } = require("../middleware/Authorization.js");

////// authorizedUser ////// To Authenticate the user with JWT token

// Create account for Recruiter

router.post("/register", async (req, res) => {
  //   console.log(req.body);
  const isuserExist = await Recruiter.findOne({ email: req.body.email });

  if (isuserExist) return res.status(400).json("account already exist");

  try {
    const salt = await bcrypt.genSalt(9);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUser = new Recruiter(req.body);
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

// update the Recruiter Details

router.post("/update", authorizedUser, async (req, res) => {
  // console.log(req.body);
  try {
    const updateRecruiter = await Recruiter.findOneAndUpdate(
      { email: req.body.email },
      req.body
    );
    // console.log(updateRecruiter);
    res.status(200).send(updateRecruiter);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// Get the Recruiter Detail by ID

router.get("/getrecruiterdetail/:id", authorizedUser, async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const getRecruiter = await Recruiter.findById(id);
    res.status(200).send(getRecruiter);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});
module.exports = router;
