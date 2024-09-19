require('dotenv').config({path: './env'})
const express = require('express')
const app = require('./app.js')

const connectDB = require('./config/db')

connectDB()
.then(()=> {
     app.listen(process.env.PORT || 4000, ()=> console.log(`Server running at port : ${process.env.PORT}`))
})
.catch((err)=> console.log(err))