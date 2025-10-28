import { Router } from "express";
import { readJson } from "../db.js";
const router = Router();

router.get("/", (_req,res)=>{
  const products = readJson("products.json");
  res.json(products);
});

export default router;
