import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    }
})

export default mongoose.model("Connection", ConnectionSchema);