import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler( async(req,res)=>{
   //get user details from frontend
   //validation 
   //check email,name already exist aur not 

   const {fullname,username,email,password}=req.body
   console.log(req.body);
   if(
    [fullname,username,password,email].some((field)=>
    field?.trim()==="")
   ){
    throw new  ApiError(400,"All fields are required")
   }

  const existUser=  await User.findOne({
    $or:[{username},{email}]
   })

   if(existUser){
    if(existUser.email===email){
      throw new ApiError(400,"Email already Exist")
    }
    if(existUser.username===username){
      throw new ApiError (400,"Username Already Exist")
    }
   }

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar file is required");
}

const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

const avatar = await uploadOnCloudinary(avatarLocalPath);
if (!avatar) {
  throw new ApiError(500, "Avatar upload failed");
}

let coverImage;
if (coverImageLocalPath) {
  coverImage = await uploadOnCloudinary(coverImageLocalPath);
}


  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser=await User.findById(user._id).select(

    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,"User Not register")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )
})

export {registerUser}


