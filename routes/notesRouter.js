const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Authorization not valid." });

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const childPagesSchema = mongoose.Schema({
  id: String,
  title: String,
});

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    childPages: {
      type: [childPagesSchema],
      default: undefined,
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesSchema);

const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user_id: req.user.id });
    res.json(notes);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const createNotes = async (req, res) => {
  try {
    const { title, content, date, childPages } = req.body;
    const newNote = new Notes({
      title: title,
      content: content,
      date: date,
      user_id: req.user.id,
      name: req.user.name,
      childPages: childPages,
    });

    await newNote.save();
    res.json({ msg: "Created a Note", id: newNote._id });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteNotes = async (req, res) => {
  try {
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted the Note" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, date, childPages } = req.body;
    await Notes.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: title,
        content: content,
        date: date,
        childPages: childPages,
      }
    );
    res.json({ msg: "Notes Updated" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    res.json(note);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

router.route("/").get(auth, getNotes).post(auth, createNotes);

router
  .route("/:id")
  .get(auth, getNote)
  .put(auth, updateNote)
  .delete(auth, deleteNotes);

module.exports = router;
