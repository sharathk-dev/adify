import express from "express";
import router from "./routes/index.routes.js";
import cors from "cors";
import swagger from "./utils/swagger.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Apply cors middleware here
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router); // Your routes
app.use("/api-docs", swagger.serve, swagger.setup);

app.get("/", (req, res) => {
  res.send("Adify API Server is running! Visit /api-docs for API documentation.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
