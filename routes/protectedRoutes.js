import { Router } from "express";
import userController from "../controllers/user/userController.js";
import connectionController from "../controllers/connection/connectionController.js";
import chatController from "../controllers/chat/chatController.js";

const router = Router();

const { GetAllUsers, GetProfile } = userController;
const { GetConnectedUser, GetConnectionRequests, ConnectionRequest, AcceptConnectionRequest, RejectConnectionRequest } = connectionController;
const { sendChat, GetChats } = chatController;

//User Routes
router.get("/users", GetAllUsers);
router.get("/profile", GetProfile);


//Connection Routes
router.get("/connections/connected/:id", GetConnectedUser);
router.get("/connections/requests", GetConnectionRequests);
router.post("/connections/request/:id", ConnectionRequest);
router.post("/connections/accept/:id", AcceptConnectionRequest);
router.post("/connections/reject/:id", RejectConnectionRequest);

//chat routes
router.post("/chat", sendChat);
router.get("/chats/:id", GetChats);

export default router;