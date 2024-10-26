// imports
const { deleteFriend } = require("../services/deleteFriendsService");
const userDAO = require("../repositories/userDAO");
const friendshipDAO = require("../repositories/friendshipDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocks
jest.mock("../repositories/userDAO");
jest.mock("../repositories/friendshipDAO");

describe("deleteFriendService", () => {
    // mock data
    const userId = "user123";
    const username = "testUser";
    const validTargetUsername = "friendUser";
    const validTargetUserId = "user456";

    // clearing mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if targetUsername is invalid", async () => {
        const response = await deleteFriend(userId, username, "");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - required username of type string" }));
    });

    test("should return a 404 response if targetUsername is not found", async () => {
        // no username found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await deleteFriend(userId, username, validTargetUsername);

        expect(response).toEqual(dataResponse(404, "fail", { message: `invalid - user ${validTargetUsername} not found` }));
    });

    test("should return a 400 response if more than one user is found", async () => {
        // 2 users found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 2 });

        const response = await deleteFriend(userId, username, validTargetUsername);

        expect(response).toEqual(dataResponse(400, "fail", { message: `invalid - more than one user by username ${validTargetUsername} found` }));
    });

    test("should return 204 and delete friend", async () => {
        // user id is returned
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: validTargetUserId }] });
        // delete friend is successful
        friendshipDAO.deleteFriend.mockResolvedValue();

        const response = await deleteFriend(userId, username, validTargetUsername);

        // delete friend gets called twice
        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith(userId, validTargetUserId);
        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith(validTargetUserId, userId);
        expect(response).toEqual(dataResponse(204, "success"));
    });
});