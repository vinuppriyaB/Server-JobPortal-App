const mongoose = require("mongoose");
const { object } = require("webidl-conversions");
const Recruiter = require("./recruiterModel.js");
const jobSchema = mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    logo: { type: String, trim: true },
    role: { type: String, trim: true },
    place: { type: String, trim: true },
    jobType: { type: String, trim: true },
    education: { type: String, trim: true },
    ExpFrom: { type: Number, trim: true },
    ExpTo: { type: Number, trim: true },
    mustHave: [{ type: String, trim: true }],
    goodToHave: [{ type: String, trim: true }],
    CTC: { type: String, trim: true },
    opening: { type: Number, trim: true },
    roundCount: { type: Number, trim: true },
    Rounds: [{ type: String, trim: true }],
    desc: { type: String, trim: true },
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
    appliedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
