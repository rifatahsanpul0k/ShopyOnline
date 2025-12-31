import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import "express-fileupload";
import fileUpload from "express-fileupload";

const app = express();

config({ path: "./config/config.env" });

app.use(
    cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    })
);

app.use(
    fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp",
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

export default app;
