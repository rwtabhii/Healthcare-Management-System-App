import mongoose from "mongoose";

// if we have to do with the mongoose
export const connectToDb = async () => {
    try {
        mongoose.connect()
        console.log("Db Connected successful")
    }
    catch (error) {
        console.log("Connection error", error)
    }
}

// if we have to do this with the mongodb

// import { MongoClient } from "mongodb";

// let client;
// // let url = came form the env file with the db name

// export const connectToMongoDb = async() => {
//     try {
//         client = MongoClient.connect()
//         console.log("✅ MongoDB Connected successfully");
//     } catch (error) {
//         console.log("❌ MongoDB Connection error:", error.message);
//     }
// }

// // for the mongodb DB access 
// export const getDb = ()=>{
//     return client.db();

// }