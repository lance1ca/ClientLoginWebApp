const validator = require('validator')
const zxcvbn = require('zxcvbn')



function validateForm(){   
    //Could also do validateForm(event), event.preventDefault() to ensure that
    // if the event is not handled, then the action shouldn't be taken

const first_name = document.getElementById('first_name').value;
const last_name = document.getElementById('last_name').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const password_confirm = document.getElementById('password_confirm').value;

let isValid = false;


//Check that all fields are filled out
if(!validator.isEmpty(first_name) || !validator.isEmpty(last_name) || !validator.isEmpty(email) || !validator.isEmpty(password) || !validator.isEmpty(password_confirm) ){
    isValid = true
}else{
    alert('You are missing fields.')
    isValid = false
}


//Check that email is valid

if(validator.isEmail(email)){
    document.getElementById('email').value = validator.normlaizeEmail(email)
    isValid = true
}else{
    alert('Invalid email address.')
    isValid = false
}

//Check that password meets the character,symbol, and number requirements
if(validator.isLength('password',{min: 8}).isStrongPassword()){
    isValid = true
}else{
    alert('Your password does not meet the requirements.')
    isValid = false
}

//Check that password passes the score test
const passwordCracking = zxcvbn(password)
const passwordScore = passwordCracking.score
const passwordSuggestions = passwordCracking.feedback.suggestions
if(passwordScore >=2){
    isValid = true
}else{
    alert('Your password scored a ' + passwordScore+"/5, please try again.")
    isValid = false
}

//Check that passwords match
if(password === password_confirm){
    isValid = true
}else{
    alert('Your passwords did not match, try again.')
    isValid = false
}



if(isValid){
    document.getElementById('register').submit()
}

}


