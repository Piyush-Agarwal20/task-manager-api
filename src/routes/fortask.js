import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { taskModel,validateDocument} from "../models/task.js";
import { filterrequest} from "../middleware/foruser.js";
import { authMiddleware } from "../middleware/auth.js";
const express = require("express");
const router = express.Router(filterrequest);

router.use(filterrequest)

//================== for posting task ============================
router.post("/",authMiddleware,async (req,res)=>{
    const data = new taskModel({
        ...req.body,
        owner:req.user._id,
    });
    try {
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({error:"there was error while registering data."})
    }
})


//===========================for getting task=======================
router.get("/",authMiddleware,async(req,res)=>{
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed ==="true";
    }
    if(req.query.sortBy){
        let sortObj = req.query.sortBy.split(":");
        sort[sortObj[0]] = sortObj[1]=== "desc"?-1:1;
    }
    try {
        // const users = await taskModel.find({owner:req.user._id});
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.status(200).json(req.user.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"there was error file fetching users."})
    }
})

router.get("/:id",authMiddleware ,async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await taskModel.findOne({_id,owner:req.user._id});
        // console.log(user);
        if(!user){
            res.status(404).send({error:"no task was found with this id."});
            return;
        }    
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"There was error while connecting to db."});
    }
})

//==================For updating ======================================


router.patch("/:id",authMiddleware,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description","completed"];
    const isValidOperation = updates.every(i=>allowedUpdates.includes(i));

    if(!isValidOperation){
        res.status(400).send({error:"Invalid updates !"});
        return;
    }
    const _id = req.params.id;
    try {
        const task = await taskModel.findOne({_id,owner:req.user._id});
        if (!task) {
            res.status(404).send({error:"no task was found with this id."});
            return;
        }
        updates.forEach(update=>task[update]=req.body[update]);
        await task.save();
        res.status(200).send(task);
    } 
    catch (error) {
        // console.log(error);
        res.status(400).json({error:"There was error while updating process"});
      }
});

//============================deleting a task==============================

router.delete('/:id',authMiddleware,async(req,res)=>{
    const _id = req.params.id;
    try {
        let user = await taskModel.findOneAndDelete({_id,owner:req.user._id});
        if(!user){
            res.status(404).send({error:"no task was found with the following id."});
            return ;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error:"there was an error during deleting process"});
    }
})

export default router;