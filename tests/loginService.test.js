// dependencies
const userDAO = require("../repositories/userDAO")
const jwt = require("jsonwebtoken")
const { login } = require("../services/loginService")
const { dataResponse } = require("../utils/dataResponse")
const bcrypt = require("bcrypt")

// mocks
jest.mock("../repositories/userDAO")
jest.mock("jsonwebtoken")
jest.mock("bcrypt")

describe("loginService", () => {
    // no user found
    test("should return message 'Username and/or Password do not match' if user is not found", async () => {
        // mocking the expected response
        const expectedResponse = dataResponse(401, "fail", {
            message: "Username and/or Password do not match!",
        })

        // mocking the returnign object from DAO layer
        userDAO.getUserByUsername.mockResolvedValue({ Items: [], Count: 0 })

        // calling the service layer funciton
        const response = await login("nonExistingUsername")

        // checking responses
        expect(response).toEqual(expectedResponse)
    })

    // passwords do not match
    test("should return message 'Username and/or Password do not match' if passwords do not match", async () => {
        // mocking the expected response
        const expectedResponse = dataResponse(401, "fail", {
            message: "Username and/or Password do not match!",
        })

        // mocking bcrypt response
        bcrypt.compareSync.mockReturnValue(false)

        // mocking the returnign object from DAO layer
        userDAO.getUserByUsername.mockResolvedValue({
            Items: [{ username: "user", password: "incorrectPassword" }],
            Count: 0,
        })

        // calling the service layer funciton
        const response = await login("user")

        // checking responses
        expect(response).toEqual(expectedResponse)
    })

    test("should return token if everything is successful", async () => {
        // creating expected response
        const data = {}
        data.token = "mockToken"
        const expectedResponse = dataResponse(200, "success", data)

        // mock object
        const dataObj = {
            Count: 1,
            Items: [
                {
                    username: "user",
                    password: "password",
                },
            ],
        }

        // mocking DAO layer
        userDAO.getUserByUsername.mockResolvedValue(dataObj)

        // mocking bcrypt value for comparing passwords
        bcrypt.compareSync.mockReturnValue(true)

        // mock jwt return value
        jwt.sign.mockReturnValue("mockToken")

        // calling the service layer function
        const response = await login("user")

        // compare results
        expect(response).toEqual(expectedResponse)
    })
})
