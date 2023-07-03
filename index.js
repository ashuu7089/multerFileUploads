const express = require('express');
require('dotenv').config() ;
require('./models/config')
const app = express()
app.use(express.json())
const router = require('./routers/userRouter')
const cookie = require('cookie-parser')
app.use('/', router)
app.use(cookie())

app.listen(process.env.PORT, (req, res)=>{
    console.log(`server running on port number ${process.env.PORT}`)
})