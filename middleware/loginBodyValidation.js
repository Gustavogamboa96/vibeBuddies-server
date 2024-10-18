const { dataResponse } = require("../utils/dataResponse");

function loginBodyValidation(req, res, next) {
    /**
     * middleware function to handle the checking of the body params
     * 
     * username - required
     * password - required
     */

    // destructuring the body
    const { username, password } = req.body;

    // block to handle any incorrect data
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {

        let data = {};

        // block if both username and passwords are missing
        if (!username && !password) {
            // constructing data
            data.message = "username and password are required";
        }
        // block for missing username
        else if (!username) {
            // constructing data
            data.message = "username is required";
        }
        // block for missing password
        else if (!password) {
            // constructing data
            data.message = "password is required";
        }

        else if (typeof username !== "string" && typeof password !== "string") {
            // constructing data
            data.message = "invalid username and password types";
        }
        // block checks that params are valid strings
        else if (typeof username !== "string") {
            // constructing data
            data.message = "invalid username type";
        }

        // block checks that params are valid strings
        else if (typeof password !== "string") {
            // constructing data
            data.message = "invalid password type";
        }

        // constructing response
        const response = dataResponse(400, "fail", data);

        // returning response
        return res.status(response.httpStatus).json({
            status: response.status,
            data
        });
    }

    next();



}

module.exports = { loginBodyValidation }; 