import express from "express";
import { gitService } from "../services/gitService.js";

const router = express.Router();

router.get("/status", async (req, res) => {
  res.send(await gitService.status());
});

router.post("/pull", async (req, res) => {
  res.send(await gitService.pull());
});

router.post("/add", async (req, res) => {
  res.send(await gitService.add());
});

router.post("/commit", async (req, res) => {
  const { message } = req.body;
  res.send(await gitService.commit(message));
});

router.post("/push", async (req, res) => {
  res.send(await gitService.push());
});

router.post("/sync", async (req, res) => {
  res.send(await gitService.sync());
});

export default router;
