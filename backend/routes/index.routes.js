import express from "express";
import { recordClickLogger } from "../controllers/adclicks.controller.js"; 

const router = express.Router();

router.get("/clickLogger", recordClickLogger); 

export default router; 
