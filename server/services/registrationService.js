const userDAO = require("../repositories/userDAO")
const { dataResponse } = require("../utils/dataResponse")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")

/**
 * service layer function to handle the registration feature
 *
 * username password email of type string, and age of number type will be present and valid
 */

async function register(username, email, password) {
  const data = {}
  try {
    // awaits getUserByUsername query
    const returnedUsername = await userDAO.getUserByUsername(username)
    const returnedUserEmail = await userDAO.findUserByEmail(email)
    // console.log("service layah: ", returnedUserEmail)

    // checks results of query to see if username already exists
    if (returnedUsername && returnedUsername.Count > 0) {
      data.message = "Username already taken"
      return dataResponse(400, "fail", data)
    } else if (returnedUserEmail && returnedUserEmail.Count > 0) {
      data.message = "Email already taken"
      return dataResponse(400, "fail", data)
    } else {
      //if req.body is valid then function will attempt to generate user awaiting the creatUser function from userDAO
      try {
        const saltRounds = 10
        let hashedPassword = await bcrypt.hashSync(password, saltRounds)
        let unique_key = uuidv4()
        const user = await userDAO.createUser({
          username,
          email,
          password: hashedPassword,
          user_id: unique_key,
        })

        const userAccount = user.user

        data.userDetails = {
          username: userAccount.username,
          email: userAccount.email,
          userId: userAccount.user_id,
        }

        // console.log(data)
        data.message = "User created successfully"
        return dataResponse(201, "success", data)
      } catch (error) {
        console.log("error is coming from service: ", error.message)
        data.message = "Failed to create new user"
        return dataResponse(500, "fail", data)
      }
    }
    //if getUserByUsername query fails
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = { register }
