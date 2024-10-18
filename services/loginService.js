const { dataResponse } = require("../utils/dataResponse");
const userDAO = require("../repositories/userDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config()

async function login(username, password) {
    /**
     * service layer function to handle the login feature
     * 
     * username and password of type string and will be present and valid
     */

    try {
        // data object that will be returned
        const data = {};

        // repository layer function call to get user by username
        const returnedUsers = await userDAO.getUserByUsername(username);

        // block checks if user does NOT exists
        if (returnedUsers.Count === 0 || returnedUsers.Items.length === 0) {
            data.message = "Username and/or Password do not match!";
            return dataResponse(401, "fail", data);
        }

        // since usernames should be unique, only 1 JSOn object should be present in the returnedUser
        const databasePassword = returnedUsers.Items[0].password;

        // block checks if passwords do NOT match
        if (!bcrypt.compareSync(password, databasePassword)) {
            data.message = "Username and/or Password do not match!"
            return dataResponse(401, "fail", data);
        }

        // array method to remove sensitive data from the returning data
        const newData = returnedUsers.Items.map(user => {
            // destructure password
            const { password, ...rest } = user;
            return rest
        });

        // creating token with user info, newData should be an array of a single object
        let token = jwt.sign(newData[0], process.env.TOKEN_SECRET_KEY, {
            expiresIn: "1d"
        })

        // creating and returning the token
        data.token = token;
        return dataResponse(200, "success", data);
    } catch (error) {
        throw new error;
    }
}

module.exports = { login }