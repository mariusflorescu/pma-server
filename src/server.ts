import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import trim from "./middleware/trim";

dotenv.config();

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import projectRoutes from './routes/project';

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN,
		optionsSuccessStatus: 200, //old browsers compatibility
	})
);

app.get("/", (_, res) => res.send("Hello form server"));
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects",projectRoutes);

app.listen(5000, async () => {
	console.log(`Server running on localhost:${process.env.PORT}`);

	try {
		await createConnection();
		console.log("Database connected successfully");
	} catch (err) {
		console.log(err);
	}
});
