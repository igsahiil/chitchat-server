import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../modules/user/userSchema.js";
import bcrypt from "bcryptjs";
dotenv.config();


const Login = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({status: 404, message: "User not found"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({status: 401, message: "Invalid credentials"});
    }
    const token = jsonwebtoken.sign({id: user._id}, process.env.JWT_SECRET);
    res.status(200).json({status: 200, user, token});
}

const Register = async (req, res)=>{
    const {firstName, lastName, username, email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({status: 400, message: "User already exists"});
    }
    const HashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://dummyimage.com/300x300/324ea8/fff`;
    const status = 0;
    const DisplayName = firstName + " " + lastName;
    const new_user = new User({
        firstName,
        lastName,
        displayName: DisplayName,
        username,
        email,
        password: HashedPassword,
        avatar,
        status
    })
    const UserCreate = await new_user.save();
    if(!UserCreate){
        return res.status(400).json({status: 400, message: "User not created"});
    }
    const token = jsonwebtoken.sign({id: UserCreate._id}, process.env.JWT_SECRET);
    res.status(200).json({status: 200, user: UserCreate, token});
}

export default { Login, Register};