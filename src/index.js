require('dotenv').config({path: './env'})
const express = require('express')
const app = express()

const connectDB = require('./config/db')
connectDB()
