class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.message=message
        this.data=data
        this.success=statusCode <400
    }
}

export {ApiResponse}

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
//   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

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