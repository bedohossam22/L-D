import express from "express";
import { register, login, verifyEmail } from "../Controllers/authcontroller.js";

const router = express.Router();

// test route
router.get("/", (req, res) => {
  res.send("Auth API is working ✅");
});

// register route
router.post("/register", register);

// login route
router.post("/login", login);

// verify token route
router.get("/verify/:token", verifyEmail);

export default router;
