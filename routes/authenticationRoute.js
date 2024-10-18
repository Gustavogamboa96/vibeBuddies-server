const express = require("express")
const router = express.Router()
const { loginController } = require("../controllers/loginController");

// middleware functions
const { loginBodyValidation } = require("../middleware/loginBodyValidation");

// middleware
const {
    registrationBodyValidation,
} = require("../middleware/registrationBodyValidation")


const {
    registrationController,
} = require("../controllers/registrationController")


router.post("/register", registrationBodyValidation, registrationController)

// route to handle the log in
router.post("/login", loginBodyValidation, loginController);


module.exports = router;