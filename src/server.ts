import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { mongodbConnect } from "./config/db.config";

import shortUrlRoutes from "./routes/shorturl";
import userRoutes from "./routes/user";


dotenv.config();
mongodbConnect();

const port = process.env.PORT || 5001;

// App
const app = express();

app.listen(port, () => {
    console.log(`🚀 server started on http://localhost:${port}`);
});


// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// routes
app.use("/api/short-url", shortUrlRoutes);
app.use("/api/auth", userRoutes);

