import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { filterrequest } from "../middleware/foruser.js";
import { authMiddleware } from "../middleware/auth.js";
import { userModel, validateDocument } from "../models/user.js";
import { taskModel } from "../models/task.js";
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            cb(new Error("Please upload image!"))
        }
        cb(undefined,true);
    }
})

const express = require("express");
const router = express.Router();

router.use(express.json())
// router.use(filterrequest);

//===================for Authenticating User================================

router.post("/login",async(req,res)=>{
    let {email=0,password=0}= req.body;
    try {
        let user = await userModel.findByCredentials(email,password);
        let token = await user.generateAuthToken();
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send({error:"there was error while login In !"});
    }
})

//=================for logging out===================================

router.post("/logout",authMiddleware,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save({ validateBeforeSave: false });
        res.status(200).send("successfully logged out !");
    } catch (error) {
        res.status(500).send({error:"server error!"});
    }
})

router.post("/logoutAll",authMiddleware,async (req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save({ validateBeforeSave: false });
        res.status(200).send("successfully logged out !");
    } catch (error) {
        res.status(500).send({error:"server error!"});
    }
})

//=========================for uploading pictures================================
router.post("/avatar",authMiddleware,upload.single("avatar"),async(req,res)=>{
    try {
        let buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save({ validateBeforeSave: false });
        res.status(200).send(req.user);
    } catch (error) {
        // console.log(error);
        res.status(400).send({error:"error while uploading process"});
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete("/avatar",authMiddleware,async(req,res)=>{
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send("profile pic was deleted successfully");
    } catch (error) {
        res.status(400).send({error:"there was error while deleting profile"});
    }
})


router.get("/avatar/:id",async(req,res)=>{
    // console.log(req.params.id);
    try {
        let user = await userModel.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set("Content-Type","image/jpg")
        res.send(user.avatar);
    } catch (error) {
        // console.log(error);
        res.status(400).send("there was some error while recieving profile pic");
    }
});

//======================== for creating user ===================================
router.post("/",async (req,res)=>{
    try {
        const result = validateDocument(req.body);
        if(result.error){
            res.status(400).json({error:"the body does not match schema defined for db"});
            return;
        }
        const data = new userModel(result.value);
        await data.validatePassword();
        await data.save();
        // sendWelcomeEmail(data.email,data.name);
        const token = await data.generateAuthToken();
        res.status(201).json({data,token});
    
    } catch (error) {
        // console.log(error);
        res.status(400).json({error:"there was error while registering data."})
    }
})


//===========================for getting user=======================
router.get("/me",authMiddleware,async(req,res)=>{
    res.status(200).send(req.user);
});


//==================For updating ======================================


router.patch("/me",authMiddleware,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name","email","password"];
    const isValidOperation = updates.every(i=>allowedUpdates.includes(i));

    if(!isValidOperation){
        res.status(400).send({error:"Invalid updates !"});
        return;
    }
    try {
        if(typeof req.body.name === "number"){
            res.status(400).send({error:"name cannot be number"});
            return;
        }
        Object.keys(req.body).forEach((i)=>{
            if(req.user[i]){
                req.user[i] = req.body[i];
            }
        });
        if(req.body.password){
            await req.user.validatePassword();
        }
        await req.user.save();
        res.status(200).send(req.user);
    } 
    catch (error) {
        // console.log(error)
        res.status(400).json({error:"There was error while updating process"});
      }
});


//========================Deleting a user ============================

router.delete('/me',authMiddleware,async(req,res)=>{
    let id = req.user._id;
    try {
        await req.user.deleteOne();
        // for deleting all the task of particular user with the related id 
        await taskModel.deleteMany({owner:id});
        res.status(200).send(req.user);
    } catch (error) {
        // console.log(error);
        res.status(400).send({error:"there was an error during deleting process"});
    }
})

export default router;