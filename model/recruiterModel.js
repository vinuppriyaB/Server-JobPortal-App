const mongoose = require("mongoose");
const { object } = require("webidl-conversions");

const recruiterSchema = mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isCandidate: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    workAt: { type: String, required: true },
    designation: { type: String, required: true },
    PostedJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  {
    timestampes: true,
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;
