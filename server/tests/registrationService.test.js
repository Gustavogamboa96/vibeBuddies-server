const userDAO = require("../repositories/userDAO")
const { register } = require("../services/registrationService")
const { dataResponse } = require("../utils/dataResponse")
const bcrypt = require("bcrypt")

jest.mock("../repositories/userDAO")
jest.mock("bcrypt")

describe("registrationService", () => {
  test("Should return message 'Username already taken' if username is already taken", async () => {
    const expectedResponse = dataResponse(400, "fail", {
      message: "Username already taken",
    })

    userDAO.getUserByUsername.mockResolvedValue({
      Items: [{ username: "username" }],
      Count: 1,
    })

    const response = await register("username1", "email@gmail.com", "password")

    expect(response).toEqual(expectedResponse)
  })

  test.skip("Should return message 'User created successfully' if user was created successfully", async () => {
    const expectedResponse = dataResponse(201, "success", {
      message: "User created successfully",
    })

    userDAO.getUserByUsername.mockResolvedValue({ Items: [], Count: 0 })
    // userDAO.createUser.mockResolvedValue({})

    const response = await register("username3", "email@gmail.com", "password")

    expect(response.httpStatus).toEqual(201)
  })
})
