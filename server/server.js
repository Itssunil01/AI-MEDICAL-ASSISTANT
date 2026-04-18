import express from "express";
import cors from "cors";
import queryRoutes from "./routes/queryRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error", err));

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/api", queryRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));