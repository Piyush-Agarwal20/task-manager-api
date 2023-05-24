import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require('path');
import {connectToMongo} from "./db/mongoose.js"; // will connect to data base 
import routerUser from "./routes/foruser.js";
import routerTask from "./routes/fortask.js";


const express = require('express');
const app = express();

connectToMongo();

const Port = process.env.PORT||3000;

app.use("/api/users",routerUser);
app.use("/api/tasks",routerTask);

app.listen(Port,()=>{
    console.log("You are connected at port:",Port)
})

// taskAppPass

