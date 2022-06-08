//THIS BRANCH IS FOR HEROKU PRODUCTION ONLY
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
  //require('dotenv').config()



}



//Creating an object Client from the pg package
const {Client} = require('pg')

//creating an object with specific parameters
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

client.connect((error) => {
    if (error) {
      if(notInProduction){
      console.error('ERROR connecting to database: \n', error.stack)
      }else{
        console.log(error.message)
      }
    } else {
      if(notInProduction){
      console.log('Connected to database successfully')
      }else{
        console.log('Connected to database successfully')
      }
    }
  })



module.exports = client