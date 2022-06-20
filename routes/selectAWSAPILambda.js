const axios = require('axios');


async function test (){
let email = "testtesttest@gmail.com";
await axios
  .get('https://d2m1ff0s6a.execute-api.ca-central-1.amazonaws.com/database-select-email',  
    { params: { email: email } },
    
  )
  .then(res => {
    //console.log(`statusCode: ${res.status}`);
    console.log("get worked");
    console.log(res.data.rowCount)
  })
  .catch(error => {
    console.error(error);
  });

}


test();
