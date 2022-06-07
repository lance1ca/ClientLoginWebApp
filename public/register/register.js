const validator = require('validator')
const bcrypt = require('bcrypt')
const zxcvbn = require('zxcvbn')


const first_name = document.getElementById('first_name').value;
const last_name = document.getElementById('last_name').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const password_confirm = document.getElementById('password_confirm').value;

let isValid = false;


function validateForm(event){

    event.preventDefault()

    
//Check that all fields are filled out
if(!validator.isEmpty(first_name) || !validator.isEmpty(last_name) || !validator.isEmpty(email) || !validator.isEmpty(password) || !validator.isEmpty(password_confirm) ){
    isValid = true
}else{
    isValid = false
}


//Check that email is valid

if(validator.isEmail(email)){
    document.getElementById('email').value = validator.normlaizeEmail(email)
    isValid = true
}else{
    alert('INVALID EMAIL :(')
    isValid = false
}

//Check that password meets the character,symbol, and number requirements
if(validator.isLength('password',{min: 8}).isStrongPassword()){
    isValid = true
}else{
    isValid = false
}

//Check that password passes the score test
const passwordCracking = zxcvbn(password)
const passwordScore = passwordCracking.score
const passwordSuggestions = passwordCracking.feedback.suggestions
if(passwordScore >=2){
    isValid = true
}else{
    isValid = false
}

//Check that passwords match
if(password === password_confirm){
    isValid = true
}else{
    isValid = false
}



if(isValid){
    document.getElementById('register').submit()
}

}


