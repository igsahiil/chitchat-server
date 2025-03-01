import userSchema from "../../modules/user/userSchema.js";
import getUserDetails from "../../utils/getUserDetails.js";

const GetAllUsers = async (req, res)=>{
    const token = req.headers.authorization;
    const user = await getUserDetails(token);
    if(!user){ 
        return res.status(404).json({status: 404, message: "User not found"});
    }
    const users = await userSchema.find({
        _id: {$ne: user._id}
    });
    res.status(200).json({status: 200, users});
}

const GetProfile = async (req, res)=>{
    const token = req.headers.authorization;
    const user = await getUserDetails(token);
    if(!user){ 
        return res.status(404).json({status: 404, message: "User not found"});
    }
    res.status(200).json({status: 200, user});
}


export default {GetAllUsers, GetProfile}