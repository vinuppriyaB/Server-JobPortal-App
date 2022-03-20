const mongoose = require("mongoose");
const { object } = require("webidl-conversions");
const recruiter = require("./recruiterModel.js");

const candidateSchema = mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isCandidate: { type: Boolean, default: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        startYear: { type: String, required: true },
        endYear: { type: String, required: true },
      },
    ],
    skills: [{ type: String, trim: true }],
    resume: { type: String, required: true },
    jobApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" }],
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
