const updateProfileService = require("../services/updateProfileService");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");
const { updateProfileSettings } = require("../utils/updateProfileSettings");

jest.mock("../repositories/userDAO");
jest.mock("../utils/updateProfileSettings");
jest.mock("../utils/dataResponse.js");

describe("updateProfileService", () => {
    describe("updateProfile", () => {

        test("should return object with Attributes", async () => {

            // mocking variables and objects
            const reqUsername = "username";
            const mockUpdateSettings = { UpdateExpression: "SET #email = :email, #age = :age" };
            const dataToUpdate = { city: "los angeles", state: 'california' };
            const dataToDelete = { country: null };

            // mock response from DAO
            const mockResponse = {
                Attributes: {
                    username: 'testuser',
                    email: 'newemail@example.com',
                    age: 30,
                    password: 'hashed_password',
                    user_id: '123456',
                }
            };

            // expected service layer response
            const expectedData = {
                username: 'testuser',
                updatedItems: {
                    email: 'newemail@example.com',
                    age: 30
                }
            };

            // mocking returned values
            updateProfileSettings.mockReturnValue(mockUpdateSettings);
            userDAO.updateProfile.mockResolvedValue(mockResponse);
            dataResponse.mockReturnValue({ status: 200, message: "success", data: expectedData });

            const result = await updateProfileService.updateProfile(reqUsername, dataToUpdate, dataToDelete);
            expect(result).toEqual({ status: 200, message: "success", data: expectedData });
        })

    })
})