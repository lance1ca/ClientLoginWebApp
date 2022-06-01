//import express library
const express = require('express');
//setup application for entire server by calling express function
const app =express();
//creating user router that contains all routes containing /users
const usersRouter = require('./routes/users');


//APP.USE ------------------------------------------------------
//setting the /users path to be the start of all usersRouter requests. So all start with /users
app.use('/users', usersRouter)

//APP.SET ------------------------------------------------------
//setting the view engine of the application to render ejs files on the server
app.set('view engine', 'ejs')



//Routes:

//get request for the root path
app.get("/", (req,res)=>{
    res.render("index", {text: "World"})
})




//initializing port for server to be an environment variable or 3000
const PORT = process.env.PORT || 3000

//Setting the app to listen on the server, and when listening to print out the link
app.listen(PORT, ()=>{
    console.log(`The server is running on local port http://localhost:${PORT}`)
})