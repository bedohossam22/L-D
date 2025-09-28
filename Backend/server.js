import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 4000;

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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
