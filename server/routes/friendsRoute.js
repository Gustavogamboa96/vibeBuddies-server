const express = require("express")
const router = express.Router()

// controller layer functions
const { sendFriendRequest } = require("../controllers/sendFriendRequestController");
const { updateFriendRequest } = require("../controllers/updateFriendRequestController");
const { retrieveAllFriends } = require("../controllers/retrieveAllFriendsController");
const { deleteFriends } = require("../controllers/deleteFriendsController");

// middleware
const authenticateToken = require("../middleware/authenticateToken");

// route to send a friend request, expects username of person in the body
router.post("", authenticateToken, sendFriendRequest);
// route to handle the accepting/denying friend request, expects either accept/deny in the body
router.patch("", authenticateToken, updateFriendRequest);
// route to handle filtering for friends by either accepted/pending, should contain a query param (status)
// by default its accepted
router.get("", authenticateToken, retrieveAllFriends)
// route to delete friends
router.delete("", authenticateToken, deleteFriends)

module.exports = router