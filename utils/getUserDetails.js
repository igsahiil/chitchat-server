import userSchema from "../modules/user/userSchema.js";
import jsonwebtoken from "jsonwebtoken";

async function getUserDetails(token){
    const cleanedToken = token.split(" ")[1];
    const decoded = jsonwebtoken.verify(cleanedToken, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await userSchema.findById(userId);
    if(!user){
        return null;
    }
    return user;
}

export default getUserDetails;