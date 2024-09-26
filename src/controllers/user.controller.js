const {asyncHandler} = require('../utils/asyncHandler')
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

     const {username, email, fullName, password} = req.body;

     if ( [username,email,fullName,password].some((field) => field?.trim()==="")) {
          throw new ApiError(400,"All fields are required")
     }

     // const existedUser = User.findOne({email});
     const existedUser = await User.findOne({
          $or : [{username}, {email}]
     })
     if(existedUser){
          throw new ApiError(409,"username or email already exist")
     }

     const avatarLocalPath = req.files?.avatar?.[0]?.path;
     const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
     if (!avatarLocalPath) {
          throw new ApiError(400, "Avatar Local Path is required")
     }
     // let coverImageLocalPath;
     // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
     //      coverImageLocalPath = req.files.coverImage[0].pa
     // }
     
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

     if (!avatar) {
          throw new ApiError(410, "Avatar file is required")
     }

     const user = await User.create({
          fullName,
          avatar:avatar.url,
          coverImage:coverImage?.url || "",
          email,
          password,
          username:username.toLowerCase(),
     })

     const createdUser = await User.findById(user._id).select("-password -refreshToken");
     if(!createdUser){
          throw new ApiError(500,"Something went wrong while registering the user");
     }

     return res.status(201).json(
          new ApiResponse(200,createdUser,"User registered successfully")
     )


})

module.exports = {registerUser}