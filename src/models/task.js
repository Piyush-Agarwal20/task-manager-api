import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
},
{ strict: 'throw',timestamps:true},
);

function validateDocument(document) {
    const schema = Joi.object({
        description:Joi.string().required(),
        completed:Joi.boolean().required()
    });
    return schema.validate(document);
}


const taskModel = new mongoose.model("task",taskSchema);

export {taskModel,validateDocument};
