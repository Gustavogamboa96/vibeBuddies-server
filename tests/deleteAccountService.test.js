// imports
const { deleteUser } = require("../services/deleteAccountService");
const vibeCheckService = require("../services/vibeCheckService");
const { deleteAllFriends } = require("../services/deleteAllFriendsService");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocks
jest.mock("../services/vibeCheckService");
jest.mock("../services/deleteAllFriendsService");
jest.mock("../repositories/userDAO");

// suite test
describe("deleteAccountService", () => {
    const username = "testUser";
    const userId = "user123";

    // clearing the mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should delete all vibe checks, friends, and the user", async () => {
        // nothing gets returned
        vibeCheckService.deleteAllVibeChecksByUserId.mockResolvedValue();
        // nothing gets returned
        deleteAllFriends.mockResolvedValue();
        // nothing gets returned
        userDAO.deleteUserById.mockResolvedValue();

        const response = await deleteUser(username, userId);

        // making sure all functions get called
        expect(vibeCheckService.deleteAllVibeChecksByUserId).toHaveBeenCalledWith(userId);
        expect(deleteAllFriends).toHaveBeenCalledWith(userId);
        expect(userDAO.deleteUserById).toHaveBeenCalledWith(username);

        expect(response).toEqual(dataResponse(204, "success"));
    });

});