// imports
const { retrievePersonalInformation } = require("../services/retrievePersonalInformationService");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking dao
jest.mock("../repositories/userDAO");

describe("retrievePersonalInformationService", () => {
    // data
    const username = "testUser";

    // clearing all the mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 404 response if the user is not found", async () => {
        // no user found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await retrievePersonalInformation(username);

        expect(response).toEqual(dataResponse(404, "fail", { message: `invalid - user ${username} not found` }));
    });

    test("should return a 200 response with user information excluding sensitive data", async () => {
        // returning user information
        const userData = {
            user_id: "user123",
            username: username,
            email: "test@example.com",
            password: "securepassword",
            age: 30
        };

        // mocking the returning information
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [userData] });

        const response = await retrievePersonalInformation(username);

        // ensuring funciton gets called
        expect(userDAO.getUserByUsername).toHaveBeenCalledWith(username);
        // expected result
        expect(response).toEqual(
            dataResponse(200, "success", { user: { username: username, email: "test@example.com", age: 30 } })
        );
    });
});