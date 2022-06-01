//import express library
const express = require('express');
//setup application for entire server by calling express function
const app =express();



//Routes:

//get request for the root path
app.get("/", (req,res)=>{
    res.send("Hello")
})



//initializing port for server to be an environment variable or 3000
const PORT = process.env.PORT || 3000

//Setting the app to listen on the server, and when listening to print out the link
app.listen(PORT, ()=>{
    console.log(`The server is running on local port http://localhost:${PORT}`)
})