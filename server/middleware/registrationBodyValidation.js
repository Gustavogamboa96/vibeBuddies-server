const { dataResponse } = require("../utils/dataResponse")

// Utility function to check for illegal characters
function containsIllegalCharacters(str) {
  const illegalChars = /[<>\[\]{}()=|:;,+\*\?%&\s]/
  return illegalChars.test(str)
}

function registrationBodyValidation(req, res, next) {
  /**
   * middleware function to handle the checking of the body params
   *
   * username - required
   * age - required
   * email - required
   * password - required
   */

  // destructuring the body
  const { username, email, password } = req.body

  // block to handle any incorrect data
  if (
    !username ||
    !email ||
    !password ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    username.length < 7 ||
    username.length > 25 ||
    password.length < 7 ||
    password.length > 20 ||
    !email.includes("@") ||
    !email.includes(".com") ||
    containsIllegalCharacters(username) ||
    containsIllegalCharacters(password) ||
    containsIllegalCharacters(email)
  ) {
    let data = {}

    // block if both username and password are missing
    if (!username && !password) {
      data.message = "username and password are required"
    }
    // block for missing username
    else if (!username) {
      data.message = "username is required"
    }
    // block for missing password
    else if (!password) {
      data.message = "password is required"
    }
    // block for missing email
    else if (!email) {
      data.message = "email is required"
    } else if (typeof username !== "string" && typeof password !== "string") {
      data.message = "invalid username and password types"
    }
    // block checks that params are valid strings
    else if (typeof username !== "string") {
      data.message = "invalid username type"
    } else if (typeof password !== "string") {
      data.message = "invalid password type"
    } else if (typeof email !== "string") {
      data.message = "invalid email type"
    } else if (username.length < 7) {
      data.message = "username must be at least 7 characters"
    } else if (username.length > 25) {
      data.message = "username must be no longer than 25 characters"
    } else if (password.length < 7) {
      data.message = "password must be at least 7 characters"
    } else if (password.length > 20) {
      data.message = "password must be no longer than 20 characters"
    } else if (!email.includes("@")) {
      data.message = "email must contain '@'"
    } else if (!email.includes(".com")) {
      data.message = "email must contain '.com'"
    } else if (
      containsIllegalCharacters(username) ||
      containsIllegalCharacters(password) ||
      containsIllegalCharacters(email)
    ) {
      data.message = "Illegal characters detected"
    }

    // constructing response
    const response = dataResponse(400, "fail", data)

    // returning response
    return res.status(response.httpStatus).json({
      status: response.status,
      data,
    })
  }

  next()
}

module.exports = { registrationBodyValidation }
