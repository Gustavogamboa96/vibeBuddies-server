const { login } = require("../services/loginService");
const { errorResponse } = require("../utils/errorResponse");

async function loginController(req, res) {
    /**
     * controller function to handle the logging in feature
     * 
     * username - required body param, validated and sanitized with middelware (loginBodyValidation.js)
     * password - required body param, validated and sanitized with middelware (loginBodyValidation.js)
     */

    // destructuring params
    const { username, password } = req.body;

    // try/catch block for async calls
    try {
        // calling our service layer function, returns an object
        const response = await login(username, password);

        // responding to client with object data
        return res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data })
        });
    } catch (error) {
        console.log(error.message);
        const response = errorResponse(500, "Internal server error during loggin");
        res.status(response.httpStatus).json({
            message: response.message
        });
    }
}


module.exports = { loginController };