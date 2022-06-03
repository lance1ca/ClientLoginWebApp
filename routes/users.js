
//This allows us to access the env file
require('dotenv').config()
//importing required npm packages and creating a new router
const express = require('express');
const router = express.Router();
const client = require('../database.js')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const flash = require('connect-flash')
const expressFlash = require('express-flash')
const session = require('express-session')
const { body, validationResult } = require('express-validator');


//passport stuff
const initializePassport = require('../passport.js')
const passport = require('passport');
const { append } = require('express/lib/response');
initializePassport(passport, 
    email =>{
    return users.find(user => user.email ===email)
})

router.use(express.urlencoded({extended:true}))

router.use(flash())
router.use(expressFlash())

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //Should we resave our session variables if nothing has changed
    saveUninitialized : false //Do you want to save an empty value in session if there is no value
}))

router.use(passport.initialize())
router.use(passport.session())


//routers allow us to nest itself inside a parent route like users
//so each router.get will automatically have /users/_______
router.get('/login', (req,res)=>{
    res.render("login", {register_message: req.flash('register_message')})
})

router.get('/register', (req,res)=>{
    res.render("register", {register_errors: req.flash('register_errors')})
})

router.get('/dashboard', (req,res)=>{
    console.log(req.body.first_name)
    res.render("dashboard", {name: req.flash('name')})
})

router.get('/logout', (req,res)=>{
    res.render("logout")
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}))

/*
,(req,res)=>{
    req.flash('login_message', login_message)
    res.redirect('/users/login')
}
*/


//This route is posting the inputting information for the register user form and inserting it into the database
//we define the callback function as async since we require an await within it
router.post('/register', 
//below are our validator checks for the user input:
body('email', 'Invalid email address').isEmail().normalizeEmail(),
body('password', 'Password must be at least 8 characters, contain 1 upper case, 1 number, and 1 symbol. Please Try again').isLength({min: 4}).isStrongPassword(), 
body('password_confirm').custom((value, {req})=>{
if(value !== req.body.password){
    throw new Error('Passwords do not match')
}else{
    console.log('Passwords match')
    return true
}
}),
//This checks if the first & last name exists in the fields, then we check falsy.
//if check falsy is true, fields with falsy values ("",0,false,null) will NOT exist, so here we check if the values don't exist
body('first_name', 'First name is required').exists({checkFalsy: true}), 
body('last_name', 'Last name is required').exists({checkFalsy: true}), 

async (req,res)=>{

//logging the requests body to see user input
console.log(req.body)

const errors = validationResult(req)

if(errors.isEmpty()){
//initializing all of the required fields to be inserted
//I think you can use req.params.first_name as well.
uuid = uuidv4();
first_name = req.body.first_name
last_name = req.body.last_name
email = req.body.email
password = req.body.password


//Here we AWAIT the generation of the hashed password before proceeding
encryptedPassword = await bcrypt.hash(password,10)

//Here we log the different parameters to console before inserting into database
console.log(uuid, first_name, last_name, email, password, encryptedPassword)
 
//Here we write our insert query using our client to insert the user data into our database
//We use the syntax of $1, $2, etc as placeholders for the values in the array that follow it
//Then we have a callback function that displays if the user was registered or if an error occurred
client.query(
     `INSERT INTO clients (id, first_name, last_name, email, password)
     VALUES ($1, $2, $3, $4, $5)`, [uuid,first_name, last_name,email,encryptedPassword], (error,result)=>{
         if(error){
             console.log("ERROR registering user and inserting values into database")
             console.log(error)
         }else{
             //show that the user has been successfully registered on console
             console.log('User successfully registered')

            
            req.flash('register_message', 'Account created successfully')
             //redirect the user to the login page, and send in the successful register message
             res.redirect('/users/login')
         }
     } 
 )
    }else{
        let register_errors = []
console.log(errors)
        //for loop to iterate through all errors (if any), and extract their messages
        for(let i=0; i < errors.errors.length; i++){
            //console.log("message:" +i +" "+errors.errors[i].msg)
            register_errors[i]= errors.errors[i].msg
        }

        
    
        // Then we redirect the user back to the register page and send in the allErrors array
        // which will be used to display the errors
        req.flash('register_errors', register_errors)
        res.redirect('/users/register')

      
    }

})

//:name of parameter, enables router to get any route with any user_id after 
//NOTE: put these lower, if on top this will be triggered first 
//PUT STATIC ROUTES ABOVE DYNAMIC ROUTES
// router.get('/users/:user_id', (req,res)=>{
//     req.params.user_id
//     res.send("logout")
// })


//Look into router.route() and chaining get,put,delete etc when needed later on
//Look into router.param() when needed



//exporting the router for use in server.js
module.exports = router;
