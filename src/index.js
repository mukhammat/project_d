import express from "express";
import path from "path";
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

const PORT = 5566;
const __dirname = path.resolve();

import { productRouter } from "./routers/product.router.js"
  
app.use("/api/products", productRouter())

app.use(express.static(path.join(__dirname, "public/dist")));
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public/dist", "index.html"));
});

app.use('/img', express.static(path.join(process.cwd(), 'imgs')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
