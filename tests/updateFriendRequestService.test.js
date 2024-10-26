// imports
const { friendRequestUpdate } = require("../services/updateFriendRequestService");
const friendShipDAO = require("../repositories/friendshipDAO");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking daos
jest.mock("../repositories/friendshipDAO");
jest.mock("../repositories/userDAO");

describe("updateFriendRequestService", () => {
    // data
    const userId = "user123";
    const username = "testUser";
    const targetUsername = "friendUser";
    const targetUserId = "user456";

    // clearing mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if targetUsername is invalid", async () => {
        const response = await friendRequestUpdate(userId, username, "", "accepted");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - status of type string is required" }));
    });

    test("should return a 404 response if targetUsername does not exist", async () => {
        // no user found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await friendRequestUpdate(userId, username, targetUsername, "accepted");

        expect(response).toEqual(dataResponse(404, "fail", { message: "invalid - user not found" }));
    });

    test("should return a 400 response if status is invalid", async () => {
        // getting back the user 
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });

        const response = await friendRequestUpdate(userId, username, targetUsername, "");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - status of type string is required" }));
    });

    test("should return a 400 response if status is not 'accepted' or 'denied'", async () => {
        // getting back the user
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });

        const response = await friendRequestUpdate(userId, username, targetUsername, "invalidStatus");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - status can only be accepted or denied" }));
    });

    test("should return a 404 response if no friend request is found", async () => {
        // user is found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // no request is returned
        friendShipDAO.findFriendRequest.mockResolvedValue({ Count: 0 });

        const response = await friendRequestUpdate(userId, username, targetUsername, "accepted");

        expect(response).toEqual(dataResponse(404, "fail", { message: "invalid - no friend request found" }));
    });

    test("should return 200 response and accept friend request", async () => {
        // getting user
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // single friend request found
        friendShipDAO.findFriendRequest.mockResolvedValue({ Count: 1 });
        // nothing gets returned
        friendShipDAO.acceptFriendRequest.mockResolvedValue();
        // nothing gets returned
        friendShipDAO.sendFriendReuest.mockResolvedValue();

        const response = await friendRequestUpdate(userId, username, targetUsername, "accepted");

        expect(friendShipDAO.acceptFriendRequest).toHaveBeenCalledWith(userId, targetUserId, username, targetUsername);
        expect(friendShipDAO.sendFriendReuest).toHaveBeenCalledWith(userId, targetUserId, username, targetUsername, "accepted");
        expect(response).toEqual(dataResponse(200, "success", { message: "friend request accepted" }));
    });

    test("should return 200 status and deny the friend request", async () => {
        // getting user
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: targetUserId }] });
        // getting request
        friendShipDAO.findFriendRequest.mockResolvedValue({ Count: 1 });
        // nothing gets returned
        friendShipDAO.deleteFriend.mockResolvedValue();

        const response = await friendRequestUpdate(userId, username, targetUsername, "denied");

        // functions gets called twice in both directions
        expect(friendShipDAO.deleteFriend).toHaveBeenCalledWith(userId, targetUserId);
        expect(friendShipDAO.deleteFriend).toHaveBeenCalledWith(targetUserId, userId);
        // expected response
        expect(response).toEqual(dataResponse(200, "success", { message: "friend request denied" }));
    });
});