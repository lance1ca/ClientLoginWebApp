const validator = require('validator')
const zxcvbn = require('zxcvbn')



function validateForm(event){   
    
    event.preventDefault() // stops submit form to get submitted in order to do the checks first
    

const first_name = document.getElementById('first_name').value;
const last_name = document.getElementById('last_name').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const password_confirm = document.getElementById('password_confirm').value;

const passwordCracking = zxcvbn(password)
const passwordScore = passwordCracking.score
const passwordSuggestions = passwordCracking.feedback.suggestions



//Check that all fields are filled out
if(!validator.isEmpty(first_name) || !validator.isEmpty(last_name) || !validator.isEmpty(email) || !validator.isEmpty(password) || !validator.isEmpty(password_confirm) ){
    //Check that email is valid

if(validator.isEmail(email)){
    document.getElementById('email').value = validator.normalizeEmail(email)


     //Check that passwords match
     if(password === password_confirm){
    
    //Check that password meets the character,symbol, and number requirements
    if(validator.isStrongPassword(password)){

        //Check that password passes the score test
    if(passwordScore >=2){
    
        //if all of these are true, submit the form, otherwise display an error
        document.getElementById('register').submit()
    }else{
        alert('Password score was ' + passwordScore+"/5, it is not strong enough. Please try again.")
       
    }


    }else{
        alert('Password does not meet the general requirements. Please include at least 8 characters, 1 upper case, 1 number, and 1 symbol. Try again.')
    }
  
    }else{
        alert('Passwords do not match. Try again.')
       
    }   
}else{
    alert('Invalid email address.')
}
}else{
    alert('You are missing required fields.')
}


}


