//REQUIRING/IMPORTS ------------------------------------------------------
//import express library
const express = require('express');
//setup application for entire server by calling express function
const app =express();

//Creating exprress layouts for ejs files
const expressLayouts = require('express-ejs-layouts')

//Routers
//creating user router that contains all routes containing /users
const usersRouter = require('./routes/users');

//index router for template
const indexRouter = require('./routes/index')



//APP.SET ------------------------------------------------------
//setting the view engine of the application to render ejs files on the server
app.set('view engine', 'ejs')
//setting where the different views of files are coming from, this is in the current directory and views folder
app.set('views', __dirname+'/views')
//setting a layout file, so every file has the same layout (header and footer)
app.set('layout','layouts/layout')


//APP.USE ------------------------------------------------------
//ORDER OF THESE DO MATTER**

//telling app to use express layouts, and where the public (stylesheets and js and images) are stored
app.use(expressLayouts)
//This is where we set the css and js files to be href in ejs files. So we assume we are always working out of public
app.use(express.static('public'))

//setting the /users path to be the start of all usersRouter requests. So all start with /users
app.use('/users', usersRouter)
app.use('/',indexRouter)

//allows access to information from forms
app.use(express.urlencoded({extended:true}))









//Routes:

// //get request for the root path
// app.get("/", (req,res)=>{
//     res.render("index", {text: "World"})
// })




//initializing port for server to be an environment variable or 3000
const PORT = process.env.PORT || 3000

//Setting the app to listen on the server, and when listening to print out the link
app.listen(PORT, ()=>{
    console.log(`The server is running on local port http://localhost:${PORT}`)
})