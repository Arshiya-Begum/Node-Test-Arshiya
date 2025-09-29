# Node-Test-Arshiya
This respository contains solution to the questions provided in the Node-test

Below are the Questions
# Test

1. Integrate the `verifyIsSameUser` middleware into the getUser API endpoint to ensure proper user verification.

2. Implement field validation for the `createClient` and `createEmployee` API endpoints to ensure incoming data meets required criteria.

3. Develop an `updateUser` API endpoint to allow updating user information with appropriate validation.

Answers
1. `verifyIsSameUser` middleware function
    * I have implemented verifyIsSame User logic by comparing userId passed in request params and userId which is present in jwt auth token 
    * If both the Ids are same then get the user details for the provided id else throw error as "unauthorized profile access"
    * OBSERVATION : In getUser function present in /controller/user.js the very first line is to throw 406: User not exist error, this was blocking the code and not able to proceed no matter any id is given. So I commented this line in order to test and check my verifyIsSameUser middleware function code.
2. `createClient` and `createEmployee` validations
    * For this question I thought of having all the validations inside a validators folder and write validators for functions as an then required and called them after middleware function calls
    * I have used `express-validator` library for all the data validations. npm install express-validator is required if using this.
    * So for this question I have created /validators/user.js file, this file would have all the validations required for user i.e.., validators for createClient, createEmployee and updateUser function all in one file. As and then new functions require validations can be added here
    * For both createClient and createEmployee I created a common validator called createUserValidotor as most of the validations are same in both the function so reusing one validator looked optimal.
    * `createEmployee` has frontend interface and I was able to know are fields that are passed in the request.body. However `createClient` had no frontend interface or anywhere createClient was not called hence assuming createClient would require same validations as createEmployee. But in  createClient function in the backend has email check i.e.., if email is already exisiting then error this check was not there in createEmployee function. So Assuming all the checks same as createClient with a additionl check of email exisiting in the user model I have implemented `createUserValidator` and used this in both createClient and createEmployee route after the middleware function calls.
    * role is not passed in request body but I was calling this routes using postman and incase someone invoked api through postman and pass role in that case, I have included this validation of role should not be passed in the request body. In `createEmployee` as front end is already implemented and role is not getting passed but in case invoking the url through postman, here anyone can pass role in the request body so included this validation as well.
3. `updateUser` API endpoint
    * As this is new implementation, and no requirement is provided as such assuming the worst case scenario of all the fields are passed in the request body, however not all fields can be updated such as username this fields cannnot be updated once created, password should be updated using change password route only, role can be updated by manager only using updateRole route, so implemented all the validations in /validators/user.js `updateUserValidator` function and called it after the middleware function calls 
    * For updateUser calling the verifyIsSameUser middleware function as in this user can update his own profile.
    * Assuming city field might also be passed and it should a city from the listed pakistani cities so have included similar to the one implemented in the frontend by having constant.js.
    In the validator checking if the city is present in the pakistanicities list then only update else error.

NOTE: 
1. I have not included node modules in the github repository. Please use npm install
2. I have used node 24.8.0 version
3. I have used express-validator please install before running the code

Files changed :
1. /controllers/user.js
    Functions changes
        1. getUser - commented the first line 406 user not exist error
        2. createClient 
            * Removed the old validation of checking id username exist in DB 
            * Removed old validation of email id exist in the db
            * Included the code to throw all the errors caught from the validator function
            * Extracting only password instead of all the fields from request body
        3. createEmployee
            * Removed the old validation of checking id username exist in DB
            * Included the code to throw all the errors caught from the validator function
            * Extracting only password instead of all the fields from request body
    New Functions Added
        1. updateUser
            * Included the code to throw all the errors caught from the validator function
            * finding the user using user ID passed in the request params and updating the data passed in the request body
2. /routes/user.js
    Routes changed
        1. router.get('/get/single/:userId', verifyToken, verifyIsSameUser, getUser)
        2. router.post('/create/client', verifyToken, verifyEmployee, createUserValidator, createClient)
        3.router.post('/create/employee', verifyToken, verifyManager, createUserValidator, createEmployee)
    New Routes added
        1. router.put('/update-user/:userId', verifyToken, verifyIsSameUser, updateUserValidator, updateUser)
3. /middleware/auth.js
        New Function added
        1. added new function `verifyIsSameUser`

New Files added :
1. /validators/users.js
    * createUserValidator - for createClient and createEmployee functions
    *  updateUserValidator - for updateUser function
2. contant.js
    * included a array of all the valid pakistani cities same as front end