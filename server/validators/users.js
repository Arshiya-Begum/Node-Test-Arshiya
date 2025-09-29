import { body,param } from 'express-validator';
import { pakistanCities } from '../constant.js';
import User from '../models/user.js';

// Custom Validation to check if the user id passed in params of a route exists in the User Model
const userIDExistsInDB = param('userId').custom(async (value) => {
    // Query the User model findById using the user ID passed in the params
    const user = await User.findById(value); 
    // If no user record found in User model for the given user Id then throw error
    if (!user) {
        throw new Error('Invalid User ID. User ID does not exist');
    }
    return true; // If the contol reaches this point then the validation is passed. Returning true.
});

// All the validation for th incoming data for createClient and createEmployee in a common function
// createClient and createEmploye most of the validations are same so created a common function for both to be used 
export const createUserValidator = [
    body('firstName')
        .exists() // check if the first field exists in request body
        .withMessage('FirstName is mandatory. Please enter your first name.')
        .trim() // removing leading and trailing spaces incase only spaces are entered
        .notEmpty() // check if first name is blank empty string 
        .withMessage('FirstName cannot be empty.'),
    body('lastName')
        .exists() // check if the lastname field exists in request body
        .withMessage('LastName is mandatory. Please enter your last name.')
        .trim() // removing leading and trailing spaces incase only spaces are entered
        .notEmpty() // check if last name is blank empty string
        .withMessage('LastName cannot be empty.'),
    body('username')
        .exists() // check if the username field exists in request body
        .withMessage('Username is mandatory. Please enter a username.')
        .trim() // removing leading and trailing spaces incase only spaces are entered
        .notEmpty() // check if username is blank empty string
        .withMessage('Username cannot be empty.')
        .custom(async (usernameValue) => {
            // custom validation to check if passed username is already present in the User Model
            const user = await User.findOne({ username: usernameValue });
            if (user)
                throw new Error('Username already exist. Please enter another username.');
            return true; // If the contol reaches this point then the validation is passed. Returning true.
        }),
    body('password')
        .exists() // check if the password field exists in request body
        .withMessage('Password is mandatory. Please enter a password.')
        .trim() // removing leading and trailing spaces incase only spaces are entered
        .notEmpty() // check if password is blank empty string
        .withMessage('Password cannot be empty.'),
    body('phone')
        .exists() // check if the phone field exists in request body
        .withMessage('Phone Number is mandatory. Please enter a phone number.')
        .isNumeric() // if exists then check if only digits are passed
        .withMessage('Invalid Phone Number. Please enter digits only.'),
    body('email')
        .optional({ checkFalsy: true }) // email is a optional field andcan accept empty string
        .isEmail() // if exists then check if valid email addres is passed, i.e., contains @ and end with .[characters]
        .withMessage('Invalid Email Address. Please enter a valid email address.')
        .custom(async (emailValue, {req}) =>{
            //custom validation to check if passed email is already present in the User Model
            // This is applicable for createClient requests only.
            if (req.originalUrl.includes('create/client')) {
                const userWithEmail = await User.findOne({ email: emailValue });
                if (userWithEmail)
                    throw new Error('Email already exist. Please enter another valid email address');
            }
            return true; // If the contol reaches this point then the validation is passed. Returning true.
        }),
    body('role')
        .not() // negating the below validation, ie.., check if role should NOT exists in the request body
        .exists() // check if the role field exists in request body
        .withMessage('Role should not be passed. Only manager has authority to add/change role using updateRole.'),
]

export const updateUserValidator = [
    userIDExistsInDB, // triggering the custom validation to check if user id exists in the User model.
    body('username')
        .not() // negating the below validation, ie.., check if username should NOT exists in the request body
        .exists() // check if the username field exists in request body
        .withMessage('Username should not be passed. Username cannot be updated.'),
    body('password')
        .not() // negating the below validation, ie.., check if password should NOT exists in the request body
        .exists() // check if the password field exists in request body
        .withMessage('Password should not be passed. Use change password through login page.'),
    body('role')
        .not() // negating the below validation, ie.., check if role should NOT exists in the request body
        .exists() // check if the role field exists in request body
        .withMessage('Role should not be passed. Only manager has authority to change role using updateRole.'),
    body('phone')
        .optional() // phone number is optional, may or may not exists in the request body
        .isNumeric() // if exists then check if only digits are passed
        .withMessage('Invalid Phone Number. Please enter digits only.'),
    body('email')
        .optional({ checkFalsy: true }) // email is optional and take blank empty string
        .isEmail() // if exists then check if valid email addres is passed, i.e., contains @ and end with .[characters]
        .withMessage('Invalid Email Address. Please enter a valid email address.'),
    body('city')
        .optional() // city is optional, may or may not exists in the request body
        .isIn(pakistanCities) // if exists then valid cites from the list of pakistani cities only should be passed
        .withMessage('Invalid City. Please enter a valid city from the drop down list only.'),
]



