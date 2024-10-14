const { register } = require("../services/registrationService")
const { errorResponse } = require("../utils/errorResponse")

async function registrationController(req, res) {
  /**
   * controller function to handle the logging in feature
   *
   * username - required body param, validated and sanitized with middelware (loginBodyValidation.js)
   * age - required body param, validated and sanitized with middelware (loginBodyValidation.js)
   * email - required body param, validated and sanitized with middelware (loginBodyValidation.js)
   * password - required body param, validated and sanitized with middelware (loginBodyValidation.js)
   */

  // destructuring params
  const { username, email, password } = req.body

  // try/catch block for async calls
  try {
    // calling our service layer function, returns an object
    const response = await register(username, email, password)

    // responding to client with object data
    res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    console.log(error.message)
    const response = errorResponse(
      500,
      "Internal server error during registration"
    )
    res.status(response.httpStatus).json({
      message: response.message,
    })
  }
}

module.exports = { registrationController }
