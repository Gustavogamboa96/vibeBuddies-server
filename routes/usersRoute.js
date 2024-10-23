const express = require("express")
const router = express.Router()

// controller layer functions
const { updateProfile } = require("../controllers/updateProfileController");
const { deleteAccount } = require("../controllers/deleteAccountController");
const { getUserByUsername } = require("../controllers/getUserByUsernameController");
const { getPersonalInformation } = require("../controllers/getPersonalInformationController")
const { updatePasswordController } = require("../controllers/updatePasswordController");


// middleware
const { dataValidation } = require("../middleware/updateProfileDataValidation");
const authenticateToken = require("../middleware/authenticateToken");

//route to update password, expects body with currentPassword, newPassword
router.patch("/password", authenticateToken, updatePasswordController);
// route to update profile, expects body with info, protected route
router.patch("", authenticateToken, dataValidation, updateProfile);
// route to delete user, expects the userId as a route param
router.delete("", authenticateToken, deleteAccount);
// route to get personal information
router.get("/profile", authenticateToken, getPersonalInformation)
// route to get a user by their username
router.get("/:username", authenticateToken, getUserByUsername);




module.exports = router
