import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import queryRoutes from "./routes/queryRoutes.js";
import path from "path";

dotenv.config({
  path: path.resolve("./.env"),
}); 

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/api", queryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});