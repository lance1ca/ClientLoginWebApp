//Code by Lance


//initialize variable first
let notInProduction = false

//if the node env is NOT in production, then we set notInProduction to true,
//which allows for console logging of different info for testing and development purposes
//Otherwise, it is false since it is in production, and no unsecure or sensitive info is logged.
if (process.env.NODE_ENV !== "production") {

   notInProduction = true
   //This allows us to access the env file
   //was not working with heroku, getting errors, going to fix later
    require('dotenv').config()

}

//importing required npm packages and creating a new router
const express = require('express');
const router = express.Router();
const client = require('../database.js')
const url = require('url')

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const flash = require('connect-flash')
const expressFlash = require('express-flash')
const session = require('express-session')
const { body, validationResult } = require('express-validator');
const zxcvbn = require('zxcvbn')

//requiring axios to do http requests and calls
const axios = require('axios');


//passport stuff
const passport = require('passport');
const initializePassport = require('../passport.js')
initializePassport(passport)

router.use(express.urlencoded({extended:false}))
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //Should we resave our session variables if nothing has changed
    saveUninitialized : false //Do you want to save an empty value in session if there is no value
}))



router.use(flash())
//router.use(expressFlash())
router.use(passport.initialize())
router.use(passport.session())

//passport flash item below:
router.use(expressFlash())




//routers allow us to nest itself inside a parent route like users
//so each router.get will automatically have /users/_______
router.get('/login',checkUserIsAuthenticated, (req,res)=>{
    
    res.render("login", {register_message: req.flash('register_message')})
})

router.get('/register', checkUserIsAuthenticated, (req,res)=>{
    res.render("register", {register_errors: req.flash('register_errors')})
})

router.get('/dashboard',checkUserIsNOTAuthenticated, (req,res)=>{
    if(notInProduction){
    console.log(req.user)
    }
    res.render("dashboard", {user: req.user.first_name})
})

router.get('/logout', (req,res)=>{
    req.logOut((error)=>{
        if(error){
            return next(error)
        }
    req.flash('logout_msg', 'You have successfully logged out')
    res.redirect('/users/login' )
    });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}))




//This route is posting the inputting information for the register user form and inserting it into the database
//we define the callback function as async since we require an await within it

router.post('/register', 
//below are our validator checks for the user input:
body('email', 'Invalid email address').isEmail().normalizeEmail(),
body('password', 'Password must be at least 8 characters, contain 1 upper case, 1 number, and 1 symbol. Please Try again').isLength({min: 8}).isStrongPassword(), 
body('password').custom((value)=>{
//password strength stuff
const passwordCracking = zxcvbn(value)


const passwordScore = passwordCracking.score
const passwordSuggestions = passwordCracking.feedback.suggestions
if(notInProduction){
console.log(passwordCracking)
console.log("The users password scored a " + passwordScore +" out of 5")
console.log("Suggestions for the users password " + passwordSuggestions)
}

if(passwordScore <2){
    throw new Error('Password must have a score of at least 2/5, your password scored ' + passwordScore +"/5\n" +"\nTry these suggestions:\n"+passwordSuggestions)
}else{
    //console.log('Password is strong enough and scored ' + passwordScore +"/5, proceeding to next check.")
    return true
}

}),
body('password_confirm').custom((value, {req})=>{
if(value !== req.body.password){
    throw new Error('Passwords do not match')
}else{
    if(notInProduction){
    console.log('Passwords match')
    }
    return true
}
}),
//This checks if the first & last name exists in the fields, then we check falsy.
//if check falsy is true, fields with falsy values ("",0,false,null) will NOT exist, so here we check if the values don't exist
body('first_name', 'First name is required').exists({checkFalsy: true}), 
body('last_name', 'Last name is required').exists({checkFalsy: true}),
//This checks if a user already exists in the database with the email being registered in the register section
//AKA this checks if the user already has an account made with this email.
body('email', 'User with this email is already registered, please log in.').custom(async (value)=>{
//trying to run the query and AWAITING its result before proceeding
//catching an error and printing a descriptive message out if it fails

//initializing the number of rows returned for a user with a specific email
let numOfRows;
    try{
        //here we set results to be the awaited return of the axios get request to my aws api and aws lambda function which does the
        // query for me using HTTPS SSL connection.
        results = await axios
        //.get('https://d2m1ff0s6a.execute-api.ca-central-1.amazonaws.com/database-select-email',  
        .get('https://yf75f3sw9d.execute-api.ca-central-1.amazonaws.com/default/REST-database-email-select',
          { params: { email: value } },
          
        )
        .then(res => {
          //console.log(`statusCode: ${res.status}`);
          //console.log("get worked");
         // then we set the number of rows to be the responses.data.rowCount 
         //if this is greater than 0, then a user with this email already exists.
          numOfRows = res.data.rowCount;
          //console.log(res.data.rowCount)
          //console.log(numOfRows);
        })
        .catch(error => {
          console.error(error);
        });


    //Without AWS lambda / AWS API gateway, you can just use this syntax to query using client.query
    // results = await client.query(`
    // SELECT * FROM clients WHERE email = $1`, [value])
}catch (error){
    if(notInProduction){
    console.error('Error trying to query database to check if a user with the entered email already exists upon registration.')
    }else{
        console.log(error)
    }
}

if(notInProduction){
console.log("RESULTS OF EMAIL QUERY:\n",results.rows)
}

// This has now been updated for aws lambda calls with numOfRows
    // if the results objects rows length is greater than 0, aka if the number of rows
    //returned from the database query is more than 0, then there is another user with this email
    //and hence we throw an error with a message, otherwise, we indicate success and that no user has this email
    // and we proceed to register the user
        // if(results.rows.length > 0){
            if(numOfRows>0){
            
            throw new Error('A user with this email is already registered, please log in.')
        }else{
            
            if(notInProduction){
            console.log('This email has not been registered before, proceeding to register new user.')
            }
            return true
        }

        
    }), 

async (req,res)=>{
    

//logging the requests body to see user input
if(notInProduction){
console.log("REQUEST BODY: \n",req.body)
}

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
if(notInProduction){
console.log(uuid, first_name, last_name, email, password, encryptedPassword)
}
 
//Here we write our insert query using our client to insert the user data into our database
//We use the syntax of $1, $2, etc as placeholders for the values in the array that follow it
//Then we have a callback function that displays if the user was registered or if an error occurred

 //here we await the results to be returned from the axios post request to my aws api and aws lambda function which does the
// insert query for me using HTTPS SSL connection. Here we send all the required information to the lambda function which does the inserting for us.
await axios
  //.post('https://tenevq35d6.execute-api.ca-central-1.amazonaws.com/database-insert', { THIS IS THE HTTP API
    .post('https://kxu76e17rd.execute-api.ca-central-1.amazonaws.com/default/REST-database-insert',{ //THIS IS THE REST API
    uuid:uuid,
    first_name:first_name,
    last_name:last_name,
    email:email,
    encryptedPassword: encryptedPassword
  })
  .then(res => {
    //console.log(`statusCode: ${res.status}`);
    //console.log(res);
  })
  .catch(error => {
    console.error(error);
  });


//send the user a success message when complete
req.flash('register_message', 'Account created successfully')
             //redirect the user to the login page, and send in the successful register message
              res.redirect('/users/login')





//This is the syntax to use client.query to do the insertion into the database without the use of aws lambda and aws api gateway
// client.query(
//      `INSERT INTO clients (id, first_name, last_name, email, password)
//      VALUES ($1, $2, $3, $4, $5)`, [uuid,first_name, last_name,email,encryptedPassword], (error,result)=>{
//          if(error){
//             if(notInProduction){
//              console.log("ERROR registering user and inserting values into database")
//             }else{
//              console.log(error)
//             }
//          }else{
//              //show that the user has been successfully registered on console
//              if(notInProduction){
//              console.log('User successfully registered')
//              }

            
//             req.flash('register_message', 'Account created successfully')
//              //redirect the user to the login page, and send in the successful register message
//              res.redirect('/users/login')
//          }
//      } 
//  )
    }else{
        let register_errors = []
        if(notInProduction){
        console.log('ERRORS BELOW\n',errors)
        }
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


//this checks if the user is authenticated, if they are we redirect them to
//the dashboard, otherwise we proceed to the next middleware
function checkUserIsAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/users/dashboard')
    }else{
        next()
    }
}

//this checks if the user is not authenticated, if they are, we proceed,
//if they are not, then we redirect them to the login page
function checkUserIsNOTAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/users/login')
    }
}



//exporting the router for use in server.js
module.exports = router;
