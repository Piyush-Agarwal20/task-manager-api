import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose = require('mongoose');

let dbUrl = process.env.MONGODB_URL;

const connectToMongo = ()=>{
    mongoose.connect(dbUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex: true,
        autoIndex: true,
    }).then(i=>{
        console.log("connected successfully to mongodb database");
    })
    .catch(err=>{
        console.log("err while connecting the db");
    })
}

export {connectToMongo};

