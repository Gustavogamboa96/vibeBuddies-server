// imports
const { deleteAllFriends } = require("../services/deleteAllFriendsService");
const friendshipDAO = require("../repositories/friendshipDAO");

// mocking the repository layer
jest.mock("../repositories/friendshipDAO");

describe("deleteAllFriendsService", () => {
    const userId = "user123";

    // clearing the mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should delete sent pending friend requests", async () => {
        // sent out requests and accepted requests
        friendshipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: 0 });
        // pending requests
        friendshipDAO.retrievePendingRequestSent.mockResolvedValue({
            Count: 1,
            Items: [{ userId: "user123", targetUserId: "user456" }],
        });

        await deleteAllFriends(userId);

        // deleting all requests
        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith("user123", "user456");
    });

    test("should delete accepted friends", async () => {
        // mocking accepted requests
        friendshipDAO.retrieveAllFriendsByStatus.mockResolvedValueOnce({
            Count: 1,
            Items: [{ userId: "user123", targetUserId: "user456" }]
        });
        // pending requests
        friendshipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: 0 });
        // sent out requests
        friendshipDAO.retrievePendingRequestSent.mockResolvedValue({ Count: 0 });

        await deleteAllFriends(userId);

        // expecting the function to be called twice
        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith("user123", "user456");
        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith("user456", "user123");
    });

    test("should delete pending friend requests", async () => {
        friendshipDAO.retrieveAllFriendsByStatus
            // accepted request
            .mockResolvedValueOnce({ Count: 0 })
            // pending requests
            .mockResolvedValueOnce({
                Count: 1,
                Items: [{ userId: "user123", targetUserId: "user789" }]
            });
        // sent out requests
        friendshipDAO.retrievePendingRequestSent.mockResolvedValue({ Count: 0 });

        await deleteAllFriends(userId);

        expect(friendshipDAO.deleteFriend).toHaveBeenCalledWith("user123", "user789");
    });

    test("no accepted, pending or sent out requests, deleteFriend should not be called", async () => {
        friendshipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: 0 });
        friendshipDAO.retrievePendingRequestSent.mockResolvedValue({ Count: 0 });

        await deleteAllFriends(userId);

        expect(friendshipDAO.deleteFriend).not.toHaveBeenCalled();
    });
});