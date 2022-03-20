const jwt = require("jsonwebtoken");
const Candidate = require("../model/candidateModel");
const Recruiter = require("../model/recruiterModel");

const authorizedUser = async (req, res, next) => {
  let token = req.headers.token;
  console.log(token);
  if (!token) {
    res.status(401).send({ msg: "user is not authorized" });
  }
  try {
    let decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decode);

    req.user = await Candidate.findOne({ email: decode.email }).select(
      "-password"
    );

    if (req.user == null) {
      req.user = await Recruiter.findOne({ email: decode.email }).select(
        "-password"
      );
      //   console.log(req.user);
      next();
    } else {
      //   console.log(req.user);

      next();
    }
  } catch (e) {
    res.send(e);
  }
};

module.exports = { authorizedUser };
