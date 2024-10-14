const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const vibeCheckController = require("../controllers/vibeCheckController");


router.post("/", authenticateToken, vibeCheckController.createVibeCheckController)

router.get("/", authenticateToken, vibeCheckController.getAllVibeChecksController);

router.get("/:id", authenticateToken, vibeCheckController.getVibeCheckByIdController);

router.get("/users/:target_user_id", authenticateToken, vibeCheckController.getVibeChecksByUserIdController);

router.delete("/:id", authenticateToken, vibeCheckController.deleteVibeCheckController);

router.patch("/:id/:likeordislike", authenticateToken, vibeCheckController.likeOrDislikeController);

module.exports = router;