const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


async function initializeInfo(){
let uuid = uuidv4();
let first_name="nodejs";
let last_name = "lambdatest";
let email="email@gmail.com";
let password = "Password$!$!11";
let encryptedPassword = await bcrypt.hash(password,10);

axios
  .post('https://tenevq35d6.execute-api.ca-central-1.amazonaws.com/database-insert', {
    uuid:uuid,
    first_name:first_name,
    last_name:last_name,
    email:email,
    encryptedPassword: encryptedPassword
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
}

initializeInfo();
