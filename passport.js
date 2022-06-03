//importing required resources
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')



function initialize(passport, getUserByEmail){
    const authenticateUser = async (email, password, done)=>{
        const user = getUserByEmail(email)

        if(user ===null){
            return done(null, false,{messages: 'No user with this email exists'})
        }else{

            try{
                if(await bcrypt.compare(password, user.password)){
                    return done(null, user)
                }else{
                    return done(null, false, {messages: 'Password incorrect'})
                }

            }catch (error){
                return done(error)
            }

        }

    }
    passport.use(new LocalStrategy({user_name: 'email', password: 'password'}, authenticateUser))
    passport.serializeUser((user, done)=>{ })
    passport.deserializeUser((id, done)=>{ })

}


module.exports = initialize