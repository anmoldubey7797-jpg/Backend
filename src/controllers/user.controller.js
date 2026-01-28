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
   console.log("Email",email);
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
    throw new ApiError(400,"User with email Please")
   };

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

// const registerUser = asyncHandler(async (req, res) => {

//   const { fullname, username, email, password } = req.body;

//   if ([fullname, username, email, password].some(f => !f || f.trim() === "")) {
//     throw new ApiError(400, "All fields are required");
//   }

//   const existUser = await User.findOne({
//     $or: [{ username }, { email }]
//   });

//   if (existUser) {
//     throw new ApiError(400, "User already exists");
//   }

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;

//  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required");
//   }

//   const avatar = await uploadOnCloudinary(avatarLocalPath);

//   let coverImage;
//   if (coverImageLocalPath) {
//     coverImage = await uploadOnCloudinary(coverImageLocalPath);
//   }

//   if (!avatar) {
//     throw new ApiError(400, "Avatar upload failed");
//   }

//   const user = await User.create({
//     fullname,
//     username: username.toLowerCase(),
//     email,
//     password,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || ""
//   });

//   const createdUser = await User.findById(user._id).select("-password -refreshToken");

//   res.status(201).json(
//     new ApiResponse(201, createdUser, "User registered successfully")
//   );
// });
// export {registerUser}

