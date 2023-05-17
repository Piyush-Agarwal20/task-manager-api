import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongodb = require('mongodb-legacy');
const {ObjectID} =  require("mongodb");
const mongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017";
const connectdb = "taskmanager";

// console.log(new ObjectID());

mongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
    if(err){
        console.log("there was error while connecting to database");
        return;
    }
    console.log("db connected succesfully");

    const db = client.db(connectdb);
    db.collection("users")
    .updateMany({
        age:{$gte:23}
    },{
        $inc:{
            age:-10
        }
    }).then(i=>{
        console.log(i);
    }).catch(err=>{
        console.log("there was error");
    })
    .finally(()=>{
        client.close();
    })

})












// // Create Instance of MongoClient for mongodb
// const client = new MongoClient('mongodb://localhost:27017',{ useNewUrlParser:true,useUnifiedTopology: true})
// // console.log(client);
// async function connectToDatabase(){
//     await client.connect();
//     let s = await client.db('taskmanager').collection('users').insertOne({
//         name:"piyush",
//         age:23,
//     });
//     console.log(s.ops);
//     return t;
// }
// connectToDatabase().then(i=>console.log("data added successfully"))
// .catch(err=>console.log("there was error while performing this operation",err.message))
// .finally(()=>client.close());










// Connect to database
// client.connect()
//     .then((i) => {
//         client.db('students').collection('students').insertOne({
//             name: 'Piyush',
//             age:23,
//         })
//         .then((res) => {
//             console.log(res)
//             client.close()
//         })
//         .catch((err) => console.log(err))

//     })
//     .catch(error => console.log('Failed to connect'));






