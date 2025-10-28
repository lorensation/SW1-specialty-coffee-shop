import express from "express";
import cors from "cors";
import products from "./routes/products.js";
import reservations from "./routes/reservations.js";
import auth from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", products);
app.use("/api/reservations", reservations);
app.use("/api/auth", auth);

app.get("/api/health", (_req,res)=>res.json({ok:true}));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
