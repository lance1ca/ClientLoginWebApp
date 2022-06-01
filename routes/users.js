//importing express and creating a new router
const express = require('express');
const router = express.Router();


//routers allow us to nest itself inside a parent route like users
//so each router.get will automatically have /users/_______
router.get('/login', (req,res)=>{
    res.send("login")
})

router.get('/register', (req,res)=>{
    res.send("register")
})

router.get('/dashboard', (req,res)=>{
    res.send("dashboard")
})

router.get('/logout', (req,res)=>{
    res.send("logout")
})

//exporting the router for use in server.js
module.exports = router;
