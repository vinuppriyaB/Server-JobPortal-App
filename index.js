const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./connection.js");
const candidateRouter = require("./routes/candidateRoute.js");
const recruiterRouter = require("./routes/recruiterRoute.js");
const jobRouter = require("./routes/jobRoute.js");
const app = express();

app.use(express.json({ limit: "50mb" }));
dotenv.config();
connectDB();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api/candidate", candidateRouter);
app.use("/api/recruiter", recruiterRouter);
app.use("/api/job", jobRouter);

app.listen(PORT, () => {
  console.log(`server start at ${PORT}`);
});
