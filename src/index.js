// import mongoose from 'mongoose'
// import { DB_NAME } from './constants.js'

// import express from 'express'
// import connectDB from './db/index.js'
// import dotenv from "dotenv";


// const app = express();

// dotenv.config({
//     path:'./env'
// })


// connectDB()
// .then(()=>{
//     app.on("Error",(error)=>{
//         console.log(error)
//         throw error
//     })
//     app.listen(process.env.PORT ||6000,()=>{
//         console.log(`The Server is running on ${process.env.PORT}`)
//     })
// })
// .catch((error)=>{
//     console.log("Error MONOGO DB is Failed",error)
// })




// // const app=express();



// // (async()=>{
// //   try{
// //    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

// //    app.on("error",(error)=>{
// //     console.log("ERROR",error)
// //    })

// //    app.listen(process.env.PORT,()=>{
// //     console.log(`App is listening in ${process.env.PORT}`)
// //    })
// //   }
// //   catch(error){
// //    console.log("ERROR",error)
// //    throw error
// //   }
// // })()

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 6000, () => {
      console.log(`Server running on ${process.env.PORT || 6000}`);
    });
  })
  .catch((err) => {
    console.log(" MongoDB error", err);
    throw err;
  });
