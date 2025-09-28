import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/emailService.js";

// helper: check if email is a work email
const isWorkEmail = (email) => {
  const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const domain = email.split("@")[1].toLowerCase();
  return !publicDomains.includes(domain);
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "recruiter" && !isWorkEmail(email)) {
      return res.status(400).json({ message: "Recruiters must use a company email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // generate verification token (expires in 1 day)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Generated token:", token);

    // ✅ pass only token (not a URL)
    await sendVerificationEmail(newUser.email, token);

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email first" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.verified = true;
    await user.save();

    res.json({ message: "Email verified successfully ✅" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
