import express from "express";
import mongoose from "mongoose";
import urlRoutes from "./urlRoute.js";
import { loggingMiddleware } from "./middleware/log.js";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error(err));

app.use("/", urlRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
