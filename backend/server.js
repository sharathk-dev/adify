import express from "express";
import router from "./routes/index.routes.js";
import cors from "cors";
import swagger from "./utils/swagger.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api", router);

// Swagger Documentation
app.use("/api-docs", swagger.serve, swagger.setup);

// Home route
app.get("/", (req, res) => {
  res.send("Adify API Server is running! Visit /api-docs for API documentation.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
