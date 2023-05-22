// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const mongoose = require('mongoose');

// let dbUrl = "mongodb://localhost/task-manager-api";

// mongoose.connect(dbUrl,{useNewUrlParser:true,
// useUnifiedTopology:true}).then(i=>{
//     console.log("connected successfully");
// })
// .catch(err=>{
//     console.log("err while connecting the db");
// })

// const taskSchema = new mongoose.Schema({
//     description:{
//         type:String,
//     },
//     completed:{
//         type:Boolean
//     }
// })

// const taskModel = new mongoose.model("task",taskSchema);

// const me = new taskModel({
//     description:"dravid",
//     completed:false
// })

// me.save().then(i=>{
//     console.log("data saved in db",i);
// })
// .catch(err=>{
//     console.log("err while saving data in db");
// })
// .finally(()=>{
//     mongoose.connection.close();
// })






// so resolve will not allowing below code to be runned
console.log("start");

function returnpromise(){
    return new Promise((resolve,reject)=>{
        resolve(45);
        console.log("this is the below resolve");
        reject("Err");
    })
}
// returnpromise().then(i=>console.log(i)).catch(err=>console.log(err));
// start
// this is the below resolve 
// end 
// 45

function returnPromise(){
    return 23;
}

async function a(){
    // let a = await returnpromise();
    // console.log(end);
    console.log("hello");
    let b = await returnPromise();
    console.log(b);
    console.log("this is simple string embedded in promises");
    return 445;
}
// a().then(i=>console.log(i)).catch(err=>console.log(err));
// start 
// hello
// end
// 23
// this is simple string embedded in promise
// 445




async function returnpromise2(){
    console.log("async await start");
    let b = await returnpromise();// so await will stop this 
    console.log(b);
    console.log("async await end");
    return b;
}
// returnpromise2().then(i=>console.log(i)).catch(err=>console.log(err));
// start
// async await start
// this is the below resolve 
// end
// 45
// async await end
// 45



function returnpromise3(){
    return new Promise((resolve,reject)=>{
        let b;
        setTimeout(() => {
            resolve(b);
        }, 1);
        // reject("Err");
        b=67;
        console.log("this is the below resolve");
    })
}

// returnpromise3().then(i=>console.log(i)).catch(err=>console.log(err));
// start
// this is the below resolve
// end
// 67

async function returnpromise4(){
    console.log("async start");
    let t = await returnpromise3();// so this will stop and other programming will start running
    console.log(t)
    console.log("this is middle of the async calle");
    let k = await returnPromise();
    console.log(k);
    console.log("promise end"); 
}

// returnpromise4().then(i=>console.log(i)).catch(err=>console.log(err));
// start
// async start
// this is below resolve
// end
// 67
// this is middle of the async calle
// 23
// promise end
// undefined


const input = "18string";
const regex = /^(\d+)([a-zA-Z]+)$/;

const result = input.match(regex);

// if (result) {
    //   const number = result[1];
    //   const string = result[2];
    
    //   console.log("Number:", number); // Output: Number: 18
    //   console.log("String:", string); // Output: String: string
    // } else {
        //   console.log("No match found");
        // }
        
        
        
        
        
function preturn(){
    return new Promise((resolve,reject)=>{
setTimeout(() => {
    resolve(34+a);
}, 4000);
let a = 67;
console.log("promise ending");
});
}

function preturn2(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(34+a);
        }, 2000);
        let a = 67;
        console.log("promise ending");
    });
}


async function abcd(){
    console.log("async func start");
    let a = await preturn();
    console.log(a);
    console.log("middle of the async funtion");
    let b = await preturn2();
    console.log("async funciton end");
    return [a,b];
}

// abcd().then(i=>console.log(i));
// start
// async func start
// promise ending
// end
// 101
// middle of the async funtion
// promise ending
// async funciton end
// [ 101, 101 ]

console.log("end");

let name = {
    fname:"piyush",
    lname:"Agarwal",
    age:56
}

// console.log(JSON.parse(JSON.stringify(name)));


let object = {
    lname:"piyush",
    fname:"agarwal",
    age:45,
    height:150,
    heightUnits:"cms",
}
let arr = [lname,fname,age];

let [] = arr;