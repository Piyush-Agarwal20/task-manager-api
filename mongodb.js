import { createRequire } from "module";
const require = createRequire(import.meta.url);

const mongodb = require('mongodb-legacy');
const mongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017";
const connectdb = "taskmanager";

mongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
    if(err){
        console.log("there was error while connecting to database");
        return;
    }
    console.log("db connected succesfully");

    const db = client.db(connectdb);

    db.collection("users").findOne({age:23},(err,result)=>{
        if(err){
            console.log("there was err while finding this data");
            return;
        }
        console.log(result);
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






