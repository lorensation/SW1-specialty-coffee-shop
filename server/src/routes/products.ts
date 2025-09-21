import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const { category } = req.query as { category?: string };
  const where = { isActive: true, ...(category ? { category } : {}) };
  const products = await prisma.product.findMany({ where, orderBy: { name: "asc" } });
  res.json(products);
});

export default router;
