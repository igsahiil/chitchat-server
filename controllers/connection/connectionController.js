import connectionSchema from "../../modules/connections/connectionSchema.js";
import userSchema from "../../modules/user/userSchema.js";
import getUserDetails from "../../utils/getUserDetails.js";
import mongoose from "mongoose";

const ConnectionRequest = async (req, res) => {
  const connectionId = req.params.id;
  const token = req.headers.authorization;
  const user = await getUserDetails(token);
  if (!user) {
    return res.status(404).json({ status: 404, message: "User not found" });
  }
  const newConnection = new connectionSchema({
    user: user._id,
    connection: connectionId,
    status: 0,
  });
  await newConnection.save();
  res.status(200).json({ status: 200, connection: newConnection });
};

const AcceptConnectionRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const connID = new mongoose.Types.ObjectId(connectionId);
    const connection = await connectionSchema.findOne({
      $or: [{ user: connID }, { connection: connID }],
      status: 0,
    });
    if (!connection) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "Connection request not found or already accepted",
        });
    }
    connection.status = 1;
    await connection.save();
    res.status(200).json({ status: 200, connection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const RejectConnectionRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const connID = new mongoose.Types.ObjectId(connectionId);
    const connection = await connectionSchema.findOne({
      $or: [{ user: connID }, { connection: connID }],
      status: 0,
    });
    if (!connection) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "Connection request not found or already accepted",
        });
    }
    connection.status = 2;
    await connection.deleteOne();
    res.status(200).json({ status: 200, connection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const GetConnectionRequests = async (req, res) => {
  const token = req.headers.authorization;
  const user = await getUserDetails(token);
  if (!user) {
    return res.status(404).json({ status: 404, message: "User not found" });
  }
  const connections = await connectionSchema.find({
    user: user._id,
    status: 0,
  });
  res.status(200).json({ status: 200, connections });
};

const GetConnectedUser = async (req, res) => {
  const token = req.headers.authorization;
  const connectionId = req.params.id;
  const connId = new mongoose.Types.ObjectId(connectionId);
  const user = await getUserDetails(token);
  const connections = await connectionSchema.find({
    $or: [
      { connection: user._id, user: connId },
      { user: user._id, connection: connId },
    ],
  });
  if (!connections) {
    return res
      .status(200)
      .json({ status: 404, message: "Connection not found" });
  }

  res.status(200).json({ status: 200, connections });
};

export default {
  ConnectionRequest,
  AcceptConnectionRequest,
  RejectConnectionRequest,
  GetConnectionRequests,
  GetConnectedUser,
};
