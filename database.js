//This allows us to access the env file
//require('dotenv').config()

//Creating an object Client from the pg package
const {Client} = require('pg')

//creating an object with specific parameters
const client = new Client({
    host: ENV["DB_HOST"],
    user: ENV["DB_USER"],
    port: ENV["DB_PORT"],
    password: ENV["DB_PASSWORD"],
    database: ENV["DB_NAME"]
})

client.connect((error) => {
    if (error) {
      console.error('ERROR connecting to database: \n', error.stack)
    } else {
      console.log('Connected to database successfully')
    }
  })



module.exports = client