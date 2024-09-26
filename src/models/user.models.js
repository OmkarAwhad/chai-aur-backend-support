const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
          username:{
               type:String,
               required:true,
               unique:true,
               lowercase:true,
               trim:true,
               index:true,  /// if any attribute ll'be used for searching then make its index true
          },
          email:{
               type:String,
               required:true,
               unique:true,
               lowercase:true,
               trim:true,
          },
          fullName:{
               type:String,
               required:true,
               trim:true,
               index:true,
          },
          avatar:{
               type:String, // cloudinary url
               required:true,
          },
          coverImage:{
               type:String,
          },
          watchHistory:[
               {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Video",
               }
          ],
          password:{
               type:String,
               required:[true,"Password is required"]
          },
          refreshToken:{
               type:String,
          }
     },{timestamps:true}
);


///// .pre hook is used to execute some program just before saving any data
userSchema.pre("save",async function(req,res,next){
     if(!this.isModified("password")){
          return next();
     }else{
          this.password = await bcrypt.hash(this.password, 10); // bcrypt.hash(kya hash karna h, kitne rounds mein) --> used to hash data
          next();
     }
})

//// Custom methods
userSchema.methods.isPasswordCorrect = async function (password){
     return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
     return jwt.sign(
          // payload
          {
               _id:this._id,
               email:this.email,
               username:this.username,
               fullname:this.fullname
          },
          // secret key
          process.env.ACCESS_TOKEN_SECRET,

          // options
          {
               expiresIn:process.env.ACCESS_TOKEN_EXPIRY,  
          }
     )
}

userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
          // payload
          {
               _id:this._id,
          },
          // secret key
          process.env.REFRESH_TOKEN_SECRET,

          // options
          {
               expiresIn:process.env.REFRESH_TOKEN_EXPIRY,  
          }
     )
}
module.exports = {
     User:mongoose.model('User',userSchema),
}
// export const User = mongoose.model('User',userSchema);