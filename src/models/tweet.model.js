import mongoose, { mongo } from "mongoose";
import { User } from "./user.model.js";

const tweetSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    },
    {timestamps:true})


export const Tweet=mongoose.model("Tweet",tweetSchema)