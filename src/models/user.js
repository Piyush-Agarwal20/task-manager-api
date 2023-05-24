import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Joi = require("joi");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
import { taskModel } from "./task.js";


const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        uppercase:true,
        validate: {
            validator: function(value) {
              return typeof value === 'string';
            },
            message: 'Name must be a string'
          }
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true,
        index: { unique: true },
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email was unvalid");
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},
{ strict: 'throw',timestamps:true},
)

userSchema.virtual("tasks",{
    ref:'task',
    localField:'_id',
    foreignField:'owner',
})

function validateDocument(document) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(document);
}

userSchema.methods.validatePassword = function () {
    const user = this;
    // console.log(user);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if(!passwordRegex.test(this.password)){
        throw new Error("password did'nt satisfy criteria");
    }
};

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save({ validateBeforeSave: false });
    return token;
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await userModel.findOne({email});
    if(!user){
        throw new Error("unable to login");
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("unable to login");
    }
    return user;
}



userSchema.pre('save',async function(next) {
    const user = this;
    try {
    //   await user.validate();
      if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
      }
      next();
    } catch (error) {
      next(error);
    }
});

const userModel = new mongoose.model("user",userSchema);

// so now this is working and will not create similar email address 
// userModel.createIndexes({ email: 1 },{unique:1});



export {userModel,validateDocument};
