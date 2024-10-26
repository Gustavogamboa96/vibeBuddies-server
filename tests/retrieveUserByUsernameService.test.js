// imports
const { retrieveUserByUsername } = require("../services/retrieveUserByUsernameService");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking dao
jest.mock("../repositories/userDAO");

describe("retrieveUserByUsernameService", () => {
    // data
    const validUsername = "testUser";

    // clearing mock
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if username is invalid", async () => {
        const response = await retrieveUserByUsername("");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - username of type string is required" }));
    });

    test("should return a 404 response if the user is not found", async () => {
        // no user is found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await retrieveUserByUsername(validUsername);

        expect(response).toEqual(dataResponse(404, "fail", { message: `invalid - user ${validUsername} not found` }));
    });

    test("should return a 200 response with user information", async () => {
        // user information that should get returned
        const userData = {
            user_id: "user123",
            username: validUsername,
            email: "test@example.com",
            password: "securepassword",
            age: 30
        };

        // returning user information
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [userData] });

        const response = await retrieveUserByUsername(validUsername);

        // checking that a function gets called
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith(validUsername);
        // expected response
        expect(response).toEqual(
            dataResponse(200, "success", { user: { username: validUsername, email: "test@example.com", age: 30 } })
        );
    });
});