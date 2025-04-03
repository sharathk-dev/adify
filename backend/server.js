import express from "express";

import router from "./routes/index.routes.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use(cors())

app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
