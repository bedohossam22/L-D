import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/auth.js";

const app = express();

// connect db
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

// ❌ remove app.listen()
// ✅ instead export app for Vercel
export default app;
