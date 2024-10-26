// imports
const { getFriendsByUsername } = require("../services/retrieveFriendsByUsernameService");
const friendShipDAO = require("../repositories/friendshipDAO");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// mocking daos
jest.mock("../repositories/friendshipDAO");
jest.mock("../repositories/userDAO");

describe("retrieveFriendsByUsernameService", () => {
    // data
    const validUsername = "testUser";
    const validUserId = "user123";

    // clearing mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a 400 response if username is invalid", async () => {
        const response = await getFriendsByUsername("");

        expect(response).toEqual(dataResponse(400, "fail", { message: "invalid - username of type string is required" }));
    });

    test("should return a 404 response if the user does not exist", async () => {
        // no friends found 
        userDAO.getUserByUsername.mockResolvedValue({ Count: 0 });

        const response = await getFriendsByUsername(validUsername);

        expect(response).toEqual(dataResponse(404, "success", { message: `user ${validUsername} not found` }));
    });

    test("should return a 200 response no friends are found", async () => {
        // single user found
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: validUserId }] });
        // no friends found
        friendShipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: 0 });

        const response = await getFriendsByUsername(validUsername);

        expect(response).toEqual(dataResponse(200, "success", { message: "no friends found" }));
    });

    test("should return a 200 response with a list of friends", async () => {
        // friends list
        const friends = [
            { userId: validUserId, targetUserId: "friend1" },
            { userId: validUserId, targetUserId: "friend2" }
        ];

        // returning user
        userDAO.getUserByUsername.mockResolvedValue({ Count: 1, Items: [{ user_id: validUserId }] });
        // returning list of friends
        friendShipDAO.retrieveAllFriendsByStatus.mockResolvedValue({ Count: friends.length, Items: friends });

        const response = await getFriendsByUsername(validUsername);

        // ensuring function being called
        expect(friendShipDAO.retrieveAllFriendsByStatus).toHaveBeenCalledWith(validUserId, "accepted");
        // message that should be returned
        expect(response).toEqual(
            dataResponse(200, "success", {
                friendList: friends,
                message: "2 items found with status accepted"
            })
        );
    });
});