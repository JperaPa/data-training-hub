import express from "express";
import cors from "cors";
import gitRoutes from "./src/routes/gitRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/git", gitRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
