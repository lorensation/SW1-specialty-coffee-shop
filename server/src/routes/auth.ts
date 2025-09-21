import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

function setAuthCookie(res: any, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
  });
}

router.post("/register", async (req, res) => {
  const parse = credsSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid body" });

  const { email, password, name } = parse.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || email.split("@")[0] },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  setAuthCookie(res, token);
  res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const parse = credsSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid body" });

  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  setAuthCookie(res, token);

  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(204).end();
});

router.get("/me", async (req, res) => {
  const auth = req.cookies?.token as string | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthenticated" });
  try {
    const payload = jwt.verify(auth, JWT_SECRET) as any;
    const me = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true }
    });
    if (!me) return res.status(401).json({ error: "Unauthenticated" });
    res.json(me);
  } catch {
    res.status(401).json({ error: "Unauthenticated" });
  }
});

export default router;
