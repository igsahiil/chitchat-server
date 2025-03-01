import jsonwebtoken from "jsonwebtoken";

const IsAuthenticated = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({status: 401, message: "Unauthorized"});
    }
    const cleanedToken = token.split(" ")[1];
    try {
        const decoded = jsonwebtoken.verify(cleanedToken, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({status: 401, message: "Unauthorized"});
    }
}

export default IsAuthenticated;