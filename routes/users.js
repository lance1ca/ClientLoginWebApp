//importing express and creating a new router
const express = require('express');
const router = express.Router();
const client = require('../database.js')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


router.use(express.urlencoded({extended:true}))

//routers allow us to nest itself inside a parent route like users
//so each router.get will automatically have /users/_______
router.get('/login', (req,res)=>{
    res.render("login")
})

router.get('/register', (req,res)=>{
    res.render("register")
})

router.get('/dashboard', (req,res)=>{
    res.render("dashboard")
})

router.get('/logout', (req,res)=>{
    res.render("logout")
})


router.post('/register', async (req,res)=>{

console.log(req.body)
uuid = uuidv4();
first_name = req.body.first_name
last_name = req.body.last_name
email = req.body.email
password = req.body.password

encryptedPassword = await bcrypt.hash(password,10)

console.log(uuid, first_name, last_name, email, password, encryptedPassword)
 client.query(
     `INSERT INTO clients (id, first_name, last_name, email, password)
     VALUES ($1, $2, $3, $4, $5)`, [uuid,first_name, last_name,email,encryptedPassword], (error,result)=>{
         if(error){
             throw error
         }else{
             console.log('user registered')
         }
     } 
 )

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
