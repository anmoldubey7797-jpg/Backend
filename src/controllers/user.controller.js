import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error("TOKEN ERROR:", error)
    throw new ApiError(500, error.message || "Something went wrong")
  }
}


const registerUser=asyncHandler( async(req,res)=>{
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

const avatar = await uploadOnCloudinary(avatarLocalPath);
if (!avatar) {
  throw new ApiError(500, "Avatar upload failed");
}

const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

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

const loginUser =asyncHandler(async(req,res)=>{
    const{email,username,password}=req.body

   console.log("LOGIN BODY:", req.body)

    if(!(email || username)){
      throw new ApiError(400,"Please Enter the details")
    }

    const user=await User.findOne({
      $or:[{email},{username}]
    })

    if(!user){
      throw new ApiError(400,"User Does not Exist")
    }

    const isPasswordValid=await user.isPasswordCorrect (password)

    if(!isPasswordValid){
      throw new ApiError(400,"Invalid Credintials")
    }

    const {accessToken,refreshToken}=await 
    generateAccessAndRefreshTokens(user._id)

   const loggedInUser=await  User.findById(user._id).
   select("-password -refreshToken")

   const options={
      httpOnly:true,
      secure:false
   }

  return res.status(200).
  cookie("accessToken",accessToken,options).
  cookie("refreshToken",refreshToken,options).
  json(
    new ApiResponse (
      200,{
        user :loggedInUser,accessToken,refreshToken
      },
      "User Logged In Successfully"
    )
  )

})

const logoutUser= asyncHandler(async(req,res)=>{
     await User.findByIdAndUpdate(
      req.user._id,{
        $set :
        {
          refreshToken:undefined
        }
      },
      {
        new :true
      }
     )

     const options={
      httpOnly:true,
      secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User Logged Out"))
})

const refreshAccessToken =asyncHandler(async (req,res)=>
  {
 const incomingRefreshToken=  req.cookies.refreshToken ||req.body.refreshToken

 if(!incomingRefreshToken){
  throw new ApiError(401,"Unauthorized request")
 }
try{
 const decodedToken=jwt.verify(
  incomingRefreshToken,
  process.env.REFRESH_TOKEN_SECRET
 )

  const user=await User.findById(decodedToken?._id)
  if(!user){
     throw new ApiError(401,"Unauthorized request")
  }

  if(incomingRefreshToken !==user?.refreshToken){
    throw new ApiError(401,"Refresh token is expired")
  }

  const options={
    httpOnly:true,
    secure:false
  }

  const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newrefreshToken,options)
  .json(
     new ApiResponse(
      200,{
        accessToken,refreshToken:newrefreshToken
      },
      "Access token Refreshed"
     )
  )
} catch(error){
  throw new ApiError(400,error?.message)
}
})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body

 const user=await User.findById(req.user?._id)

 const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

 if(!isPasswordCorrect){
    throw new ApiError(404,"Invalid Password")
 }

 user.password=newPassword
 await user.save({validateBeforeSave:false})

 return res
 .status(200)
 .json(new ApiResponse(200,{},"Password Changed"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200,req.user,"Fetch user easily")
})


const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullname,email}=req.body

  if(!fullname || !email){
    throw new ApiError(404,"Not Exist user ")
  }

 const user=await User.findByIdAndUpdate(req.user?._id,
  {
   $set:{
    fullname:fullname,
    email:email
   }

  },{new:true}
).select("-password")

return res
.status(200)
.json(new ApiResponse(200,user,"Account details successfully"))

}) 

const updateUserAvatar=asyncHandler(async(req,res)=>{
  const avatarLocalPath=req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(404,"Error not present")
  }

  const avatar=await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

  await User.findByIdAndUpdate(req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  )

  const avatarUpdate=await User.findById(req.user?._id)
  .select("-password")

  return res.status(200)
  .json(new ApiResponse(200,avatarUpdate,"Successfully update Avatar"))
 
})

// const updateUserCoverImage=asyncHandler(async(req,res)=>{
//   const coverImagePath=req.file?.path

//   if(!coverImagePath){
//     throw new ApiError(400,"Error at coverImage ")
//   }

//   const coverImage=await uploadOnCloudinary(coverImagePath)

//   if(!coverImage){
//     throw new ApiError(400,"Error At coverImage Updation")
//   }

//  const user= await User.findByIdAndUpdate(req.user?._id,{
//     $set:{
//       coverImage:coverImage.url
//     }
//   },{new:true}
// ).select("-password")

// return  res
// .status(200)
// .json(new ApiResponse(200,{message:"Successfully Update CoverImage"},user))

// })

const updateUserCoverImage=asyncHandler(async(req,res)=>{
  if(!req.file || !req.file.path){
    const user=await User.findById(req.user._id).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"No coverImage Uploaded here"))
  }

  const coverImage=await uploadOnCloudinary(req.file.path)

  if(!coverImage){
    throw new ApiError(404,"CoverImage not present please upload it")
  }
  const user=await User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        coverImage:coverImage.url,
      },
    },{new:true}
  ).select("-password")

   return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Cover image updated successfully"
    )
  );
})
export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage}


