const express = require("express")
const router = express.Router()

// controller layer functions
const { updateProfile } = require("../controllers/updateProfileController");
const { deleteAccount } = require("../controllers/deleteAccountController");
const { sendFriendRequest } = require("../controllers/sendFriendRequestController");
const { updateFriendRequest } = require("../controllers/updateFriendRequestController");
const { retrieveAllFriends } = require("../controllers/retrieveAllFriendsController");
const { deleteFriends } = require("../controllers/deleteFriendsController");

// middleware
const { dataValidation } = require("../middleware/updateProfileDataValidation");
const authenticateToken = require("../middleware/authenticateToken");


// route to update profile, expects body with info, protected route
router.patch("", authenticateToken, dataValidation, updateProfile);
// route to delete user, expects the userId as a route param
router.delete("", authenticateToken, deleteAccount);
// route to send a friend request, expects username of person in the body
router.post("/friends", authenticateToken, sendFriendRequest);
// route to handle the accepting/denying friend request, expects either accept/deny in the body
router.patch("/friends", authenticateToken, updateFriendRequest);
// route to handle filtering for friends by either accepted/pending, should contain a query param (status)
// by default its accepted
router.get("/friends", authenticateToken, retrieveAllFriends)
// route to delete friends
router.delete("/friends", authenticateToken, deleteFriends)



module.exports = router
