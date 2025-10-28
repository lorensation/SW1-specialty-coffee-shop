import { Router } from "express";
import { readJson, writeJson } from "../db.js";
import { randomUUID } from "crypto";
const router = Router();

router.get("/", (_req,res)=> res.json(readJson("reservations.json")));

router.post("/", (req,res)=>{
  const { name, date, people } = req.body;
  if(!name || !date || !people) return res.status(400).json({error:"Missing fields"});
  const db = readJson("reservations.json");
  const item = { id: randomUUID(), name, date, people };
  db.push(item);
  writeJson("reservations.json", db);
  res.status(201).json(item);
});

export default router;
