import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { taskModel,validateDocument} from "../models/task.js";
import { filterrequest} from "../middleware/foruser.js";

const express = require("express");
const router = express.Router(filterrequest);

router.use(filterrequest)

//================== for posting task ============================
router.post("/",async (req,res)=>{
    try {
        const result = validateDocument(req.body);
        if(result.error){
            res.status(400).json({error:"the body does not match schema defined for db"});
            return;
        }
        const data = new taskModel(result.value);
        await data.save();
        res.status(201).json(data);
    
    } catch (error) {
        res.status(400).json({error:"there was error while registering data."})
    }
})


//===========================for getting task=======================
router.get("/",async(req,res)=>{
    try {
        const users = await taskModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error:"there was error file fetching users."})
    }
})

router.get("/:id",async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await taskModel.findById(_id);
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
        const document = await taskModel.findById(_id);
        if (!document) {
            res.status(404).send({error:"no user was found with this id."});
            return;
        }
        let updatedDocument = await taskModel.updateOne({_id:document._id},req.body,{new:true,runValidators:true});
        updatedDocument = await taskModel.findById(_id);
        res.status(200).send(updatedDocument);
    } 
    catch (error) {
        // console.log(error);
        res.status(400).json({error:"There was error while updating process"});
      }
});

//============================deleting a task==============================

router.delete('/:id',async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await taskModel.findByIdAndDelete(_id);
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