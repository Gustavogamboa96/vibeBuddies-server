// imports
const { friendRequest } = require("../services/sendFriendRequestService");
const userDAO = require("../repositories/userDAO");
const friendshipDAO = require("../repositories/friendshipDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking daos
jest.mock("../repositories/userDAO");
jest.mock("../repositories/friendshipDAO");

describe("sendFriendRequestService", () => {
    // user data
    const userId = "user123";
    const username = "testUser";
    const targetUsername = "friendUser";
    const targetUserId = "user456";

    // clearing tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if targetUsername is invalid", async () => {
        const response = await friendRequest(userId, username, "");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - targetUsername of type string is required" }));
    });

    test("should return a 404 response if targetUsername is not found", async () => {
        // no user found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await friendRequest(userId, username, targetUsername);

        expect(response).toEqual(dataResponse(404, "fail", { message: `invalid - no user found with targetUsername: ${targetUsername}` }));
    });

    // test("should return a 400 response if attempting to send a request to oneself", async () => {
    //     const response = await friendRequest(userId, username, username);

    //     expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - can not send request to yourself" }));
    // });

    test("should return a 404 response if multiple users are found", async () => {
        // 2 users are found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 2 });

        const response = await friendRequest(userId, username, targetUsername);

        expect(response).toEqual(dataResponse(404, "fail", { message: `invalid - 2 users found with the targetUsername: ${targetUsername}` }));
    });

    test("should return a 400 response if the users are already friends", async () => {
        // returns the user they are trying to add
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // return friends found
        friendshipDAO.findFriendRequest.mockResolvedValueOnce({ Count: 1 });

        const response = await friendRequest(userId, username, targetUsername);

        expect(response).toEqual(dataResponse(400, "fail", { message: `invalid - you are already friends with ${targetUsername}` }));
    });

    test("should return a 400 response if a friend request is already pending from the target user", async () => {
        // getting user
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // seeing that that user already has a pending request for that user
        friendshipDAO.findFriendRequest.mockResolvedValueOnce({ Count: 0 }).mockResolvedValueOnce({ Count: 1 });

        const response = await friendRequest(userId, username, targetUsername);

        expect(response).toEqual(dataResponse(400, "fail", { message: `invalid - already have a pending friend request from ${targetUsername}` }));
    });

    test("should send a friend request successfully and return a 200 response", async () => {
        // getting user information
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // no pending request found and users are not already friends
        friendshipDAO.findFriendRequest.mockResolvedValueOnce({ Count: 0 }).mockResolvedValueOnce({ Count: 0 });
        // does not expect a return value
        friendshipDAO.sendFriendReuest.mockResolvedValue();

        const response = await friendRequest(userId, username, targetUsername);

        // ensuring function gets called
        expect(friendshipDAO.sendFriendReuest).toHaveBeenCalledWith(userId, targetUserId, username, targetUsername);
        expect(response).toEqual(dataResponse(200, "success", { message: `friend request sent to ${targetUsername}` }));
    });
});