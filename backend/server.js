import express from "express";
import bodyParser from "body-parser";

import router from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
