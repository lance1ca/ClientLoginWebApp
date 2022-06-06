//importing required resources
const LocalStrategy = require('passport-local').Strategy
const client = require('./database.js')
const bcrypt = require('bcrypt')



function initialize(passport){
    
    const authenticateUser = (email, password, done)=>{
        client.query(`
        SELECT * FROM clients WHERE email = $1`, [email], (error, results)=>{
            if(error){
                console.log("Error occurred querying database by user email")
            }

            //if its found the user in the database do the following
            if(results.rows.length >0){
                //results is a list, we want the first item of the list which is the user with its details
                const user = results.rows[0]

                bcrypt.compare(password, user.password, (error, isMatch)=>{
                    if(error){
                        throw error
                    }else if(isMatch){
                        //console.log("match found")
                        console.log(user)
                        return done(null, user)
                    }else{
                        //console.log(done(null, false, {messages: "Password is not correct."}))
                        return done(null, false, {message: "Password is not correct."})
                    }
                })

                //if there are no users found
            }else{
                //console.log(done(null, false, {messages: "Email is not registered, try creating an account on the register page."}))
                return done(null, false, {message: "Email is not registered, try creating an account on the register page."})
            }
        })
    }

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },authenticateUser))

    
    passport.serializeUser((user, done)=>{done(null,user.id) })
    passport.deserializeUser((id, done)=>{ 
        client.query(`SELECT * FROM clients WHERE id = $1`,[id],(error, results)=>{
            if(error){
                throw error
            }else{
                return done(null, results.rows[0])
            }
        })
    })

}


module.exports = initialize