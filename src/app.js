const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({
     origin : process.env.CORS_ORIGIN,
     credentials:true,
}))

app.use(express.json({limit:"16kb"})) /// to allow json format data
app.use(express.urlencoded()) /// If u search any name on google ,example salman khan ,,,,, in url u will see https.....salman+khan ,, sometimes salman%20khan 
/// soo url ka ek encoder hota h ,woh usse dena padta h ,, like space ka hai %20


app.use(express.static("public")) // to store public assets like pdf n images in my own server\

app.use(cookieParser())

