import express from "express";
const server = express()
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import IsAuthenticated from "./utils/middleware.js";
import { io } from "./websocket/socket.js";

dotenv.config();

server.use(cors())
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

server.use("/auth", authRoutes)
server.use("/api", IsAuthenticated, protectedRoutes)

server.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
})