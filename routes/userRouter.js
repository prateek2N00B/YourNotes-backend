const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      reequired: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (user) return res.status(400).json({ msg: "The email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username: username,
      email: email,
      password: passwordHash,
    });

    await newUser.save();
    res.json({ msg: "Sign Up Successfull" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.find({ email: email });

    if (user.length == 0)
      return res.status(400).json({ msg: "User does not exists." });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

    const payload = { id: user[0]._id, name: user[0].username };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token: token, username: user[0].username });
  } catch (err) {
    return res.status(500).json({ msg: "this is called" });
  }
};

const verifiedToken = (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.json({ msg: false, username: "" });

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
      if (err) return res.json({ msg: false, username: "" });

      const user = await Users.findById(verified.id);
      if (!user) return res.json({ msg: false, username: "" });

      return res.json({ msg: true, username: user.username });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifiedToken);

module.exports = router;
