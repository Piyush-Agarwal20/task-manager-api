import { createRequire } from "module";
const require = createRequire(import.meta.url);
import {connectToMongo} from "./db/mongoose.js"; // will connect to data base 
import routerUser from "./routes/foruser.js";
import routerTask from "./routes/fortask.js";
import { userModel } from "./models/user.js";
import { taskModel } from "./models/task.js";

const express = require('express');
const app = express();

connectToMongo();

const Port = process.env.PORT||3000;


app.use("/api/users",routerUser);
app.use("/api/tasks",routerTask);

app.listen(Port,()=>{
    console.log("You are connected at port:",Port)
})

const main = async()=>{
    // to get owner of the task

    // const task = await taskModel.findById("646c5d78a38d91e85110bca8");
    // await task.populate('owner');
    // console.log(task.owner);


    // to get all the task of the particular user

    // const user = await userModel.findById("646c51d052301c9c30f7a984");
    // await user.populate("tasks");
    // console.log(user.tasks);
}

// main();

