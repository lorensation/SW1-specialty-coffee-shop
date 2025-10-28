import { Router } from "express";
const router = Router();

router.post("/login", (req,res)=>{
  const { email, password } = req.body;
  if(email && password) return res.json({ token: "mock-token", user: { email }});
  res.status(400).json({error:"Invalid credentials"});
});

export default router;
