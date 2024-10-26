// imports
const { retrieveAllFriendsByStatus } = require("../services/retrieveAllFriendsByStatusService");
const friendShipDAO = require("../repositories/friendshipDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking dao
jest.mock("../repositories/friendshipDAO");

describe("retrieveAllFriendsByStatusService", () => {
    const userId = "user123";

    // clearing mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if status is invalid", async () => {
        const response = await retrieveAllFriendsByStatus(userId, "");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - status of type string is required" }));
    });

    test("should return a 400 response if status is not 'accepted' or 'pending'", async () => {
        const response = await retrieveAllFriendsByStatus(userId, "invalidStatus");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - query parameter status can only be accepted or pending" }));
    });

    test("should return a 200 response if no friends are found", async () => {
        // returning 0 friends
        friendShipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: 0 });

        const response = await retrieveAllFriendsByStatus(userId, "accepted");

        expect(response).toEqual(dataResponse(200, "success", { message: "no friends with status: accepted" }));
    });

    test("should return a 200 response and list of friends", async () => {
        // friends list
        const friends = [
            { userId: "user123", targetUserId: "friend1" },
            { userId: "user123", targetUserId: "friend2" }
        ];
        friendShipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: friends.length, Items: friends });

        const response = await retrieveAllFriendsByStatus(userId, "accepted");

        // retrieving all friends by a given status should be called
        expect(friendShipDAO.retrieveAllFriendsByStatus).toHaveBeenCalledWith(userId, "accepted");
        // expected response
        expect(response).toEqual(
            dataResponse(200, "success", {
                friendList: friends,
                message: "2 items found with status accepted"
            })
        );
    });
});