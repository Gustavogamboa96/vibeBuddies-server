const userDAO = require("../repositories/userDAO");
const bcrypt = require('bcrypt');
const { dataResponse } = require("../utils/dataResponse");
const logger = require('../utils/logger');

async function updatePassword(username, currentPassword, newPassword){
    const data = {};
    try{
        if(username){
                // repository layer function call to get user by username
            const returnedUsers = await userDAO.getUserByUsername(username);

            // block checks if user does NOT exists
            if (returnedUsers.Count === 0 || returnedUsers.Items.length === 0) {
                data.message = "Username does not exist!";
                return dataResponse(401, "fail", data);
            }
            // since usernames should be unique, only 1 JSOn object should be present in the returnedUser
            const databasePassword = returnedUsers.Items[0].password;

            // block checks if passwords do NOT match
            if (!bcrypt.compareSync(currentPassword, databasePassword)) {
                data.message = "Passwords do not match!"
                return dataResponse(401, "fail", data);
            }
            //if currently inputed password matches dbpassword we proceed to encrypt the newPassword
            const saltRounds = 10
            let newHashedPassword = await bcrypt.hashSync(newPassword, saltRounds)

            //send update command from dao to updatepassword
            const response = await userDAO.updatePassword(username, newHashedPassword);
            if(!response.Attributes){
                data.message = 'Could not change password';
                return dataResponse(401, "fail", data);
            }
                data.message = "Password changed succesfully"
                return dataResponse(201, "success", data);
        }else {
            data.message = 'No username was passed, might have to refresh session';
            return dataResponse(401, "fail", data);
        }
    }catch(error) {
        logger.error(`Failed to update user's password: ${error.message}`, {
            stack: error.stack,
        });
        throw new Error(error.message);
    }
}

module.exports = {updatePassword};