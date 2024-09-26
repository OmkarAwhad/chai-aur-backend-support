const asyncHandler = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {User} = require('../models/user.models.js')
const {uploadOnCloudinary} = require('../utils/cloudinary.js')
const {ApiResponse} = require('../utils/ApiResponse.js')

// const registerUser = asyncHandler( async (req,res,next) => {
//      res.status(200).json({
//           message:"Ok",
//      })
// })

const registerUser = asyncHandler( async (req,res,next) => {
     // get user details from frontend
     // check if the fields are empty
     // check if the user already exists : username or email
     // check for images , check for avatar
     // upload them to cloudinary, avatar
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation
     // return res

     const {username, email, fullname, password} = req.body;

     if ( [username,email,fullname,password].some((field) => field?.trim()==="")) {
          throw new ApiError(400,"All fields are required")
     }

     // const existedUser = User.findOne({email});
     const existedUser = User.findOne({
          $or : [{username}, {email}]
     })
     if(existedUser){
          throw new ApiError(409,"username or email already exist")
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
     
     const avatar = uploadOnCloudinary(avatarLocalPath);
     const coverImage = uploadOnCloudinary(coverImageLocalPath);
     if(!avatar){
          throw new ApiError(400, "Avatar file is required")
     }

     const user = await User.create({
          fullname,
          username:username.toLowerCase(),
          avatar:avatar.url,
          coverImage:coverImage?.url || "",
          email,
          password,
     })

     const createdUser = await User.findById(user._id).select("-password -refreshToken");
     if(!createdUser){
          throw new ApiError(500,"Something went wrong while registering the user");
     }

     return res.status(201).json(
          new ApiResponse(200,createdUser,"User registered successfully")
     )


})

module.exports = registerUser