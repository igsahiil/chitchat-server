import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import getUserDetails from "../utils/getUserDetails.js";
import userSchema from "../modules/user/userSchema.js";
import connectionSchema from "../modules/connections/connectionSchema.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    path: "/socket.io/"
});

// Map to store user ID to socket ID mappings
const connections = new Map();

server.listen(process.env.SOCKET_PORT, () => {
    console.log(`WebSocket server listening on port ${process.env.SOCKET_PORT}`);
});

io.on("connection", async (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return socket.disconnect();
    }
    const user = await getUserDetails("Bearer "+token);
    if(!user){
        return socket.disconnect();
    }

    const findUser = await userSchema.findById(user._id);
    if(!findUser){
        return socket.disconnect();
    }
    findUser.status = 1;
    await findUser.save();
    const userConnections = await connectionSchema.find({
        $or: [
            { user: user._id },
            { connection: user._id }
        ]
    });
    userConnections.forEach(element => {
        io.to(connections.get(element.connection.toString())).emit("user_status", {
            status: 1,
            id: user._id.toString()
        });
        io.to(connections.get(element.user.toString())).emit("user_status", {
            status: 1,
            id: user._id.toString()
        });
    });

    // Store user's socket connection using their MongoDB _id
    connections.set(user._id.toString(), socket.id);
    // console.log("User connected:", user._id.toString(), socket.id);
    
    socket.on("disconnect", async () => {
        // console.log("User disconnected:", user._id.toString());
        connections.delete(user._id.toString());
        const findUser = await userSchema.findById(user._id);
        findUser.status = 0;
        await findUser.save();
        socket.emit("user_status", {
            status: 0,
            id: user._id.toString()
        });
    });
});

export { io, connections };
