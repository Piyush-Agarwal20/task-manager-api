import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
import { userModel } from "../models/user.js";

// we will get the token which will have id inside it 
// then we will use verify function to decode the token 
// decoded token will have the id 
// that id will then be used to find the user and get its detail
const authMiddleware = async (req,res,next)=>{
    try {
        const token = req.header("Authorization").replace("Bearer ","");
        const decoded = jwt.verify(token,"ThiSiSMyScrEtkey");
        const user = await userModel.findOne({_id:decoded._id,"tokens.token":token});
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({error:"Authentication Failed !"});
    }
}

export {authMiddleware};

