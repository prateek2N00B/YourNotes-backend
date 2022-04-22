require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const notesRouter = require("./routes/notesRouter");
const sharedNotesRouter = require("./routes/sharedNotesRouter");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users-api", userRouter);
app.use("/notes-api", notesRouter);
app.use("/shared-notes-api", sharedNotesRouter);

const URI = process.env.MONGODB_URI;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
