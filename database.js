//This allows us to access the env file
require('dotenv').config()

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
      console.error('connection error', error.stack)
    } else {
      console.log('connected')
    }
  })



module.exports = client