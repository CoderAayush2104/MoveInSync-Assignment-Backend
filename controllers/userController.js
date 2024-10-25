const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error.js")
// User registration
exports.registerUser = async (req, res, next) => {
  const { name, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({
    name,
    email,
    passwordHash: hashedPassword,
    role: "user", // Assign role, default to "user"
  });

  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(new HttpError("Registration failed", 500));
  }
};

// User login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (error) {
    next(new HttpError("Login failed", 500));
  }
};
