import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { filterrequest } from "../middleware/foruser.js";
import { authMiddleware } from "../middleware/auth.js";
import { userModel, validateDocument } from "../models/user.js";

const express = require("express");
const router = express.Router();

// router.use(express.json())
router.use(filterrequest);

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



//===============for creating user ===================================
router.post("/",async (req,res)=>{
    try {
        const result = validateDocument(req.body);
        if(result.error){
            res.status(400).json({error:"the body does not match schema defined for db"});
            return;
        }
        const data = new userModel(result.value);
        await data.save();
        const token = await data.generateAuthToken();
        res.status(201).json({data,token});
    
    } catch (error) {
        res.status(400).json({error:"there was error while registering data."})
    }
})


//===========================for getting user=======================
router.get("/me",authMiddleware,async(req,res)=>{
    res.status(200).send(req.user);
});

router.get("/:id",async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await userModel.findById(_id);
        // console.log(user);
        if(!user){
            res.status(404).send({error:"no user was found with this id."});
            return;
        }    
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({error:"There was error while connecting to db."});
    }
})

//==================For updating ======================================


router.patch("/:id",async(req,res)=>{
    const _id = req.params.id;
    try {
        const document = await userModel.findById(_id);
        if (!document) {
            res.status(404).send({error:"no user was found with this id."});
            return;
        }
        if(typeof req.body.name === "number"){
            res.status(400).send({error:"name cannot be number"});
            return;
        }

        // let updatedDocument = await userModel.updateOne({_id:document._id},req.body,{new:true,runValidators:true});
        // updatedDocument = await userModel.findById(_id);

        Object.keys(req.body).forEach((i)=>{
            if(document[i]){
                document[i] = req.body[i];
            }
        })
        await document.save();
        res.status(200).send(document);
    } 
    catch (error) {
        // console.log(error);
        res.status(400).json({error:"There was error while updating process"});
      }
});


//========================Deleting a user ============================

router.delete('/:id',async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await userModel.findByIdAndDelete(_id);
        if(!user){
            res.status(404).send({error:"no user was found with the following id."});
            return ;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error:"there was an error during deleting process"});
    }
})

export default router;