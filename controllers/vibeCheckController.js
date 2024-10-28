const VibeCheckService = require("../services/vibeCheckService")

//post
async function createVibeCheckController(req, res) {
  // const user_id = 123456;
  const { user_id, username } = req.user
  const { album_id, review, rating } = req.body

  try {
    const response = await VibeCheckService.createVibeCheck(
      user_id,
      username,
      album_id,
      review,
      rating
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

//patch
async function createCommentController(req, res) {
  const { user_id, username } = req.user
  const { comment_body, vibe_check_id } = req.body

  try {
    const response = await VibeCheckService.createComment(
      user_id,
      username,
      vibe_check_id,
      comment_body
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (err) {
    console.error("Controller error:", err)
    return res
      .status(500)
      .json({ status: "fail", message: "Unexpected server error" })
  }
}

//delete
async function deleteCommentController(req, res) {
  const { user_id } = req.user
  const { vibe_check_id, comment_id } = req.body

  try {
    const response = await VibeCheckService.removeComment(
      user_id,
      vibe_check_id,
      comment_id
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

//get
async function getAllVibeChecksController(req, res) {
  // const user_id = 123456;
  const user_id = req.user.user_id
  try {
    const response = await VibeCheckService.getAllVibeChecks(user_id)
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

//delete
async function deleteVibeCheckController(req, res) {
  // const user_id = 123456;
  const user_id = req.user.user_id
  const vibe_check_id = req.params.id

  try {
    const response = await VibeCheckService.deleteVibeCheck(
      user_id,
      vibe_check_id
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

//patch
async function likeOrDislikeController(req, res) {
  // const user_id = 123456;
  const { user_id, username } = req.user
  const vibe_check_id = req.params.id
  const type = req.params.likeordislike

  try {
    const response = await VibeCheckService.likeOrDislike(
      user_id,
      username,
      vibe_check_id,
      type
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

async function getVibeCheckByIdController(req, res) {
  const user_id = req.user.user_id
  const vibe_check_id = req.params.id

  try {
    const response = await VibeCheckService.getVibeCheckById(
      user_id,
      vibe_check_id
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

async function getVibeChecksByUserIdController(req, res) {
  const user_id = req.user.user_id
  const target_user_id = req.params.target_user_id

  try {
    const response = await VibeCheckService.getVibeChecksByUserId(
      user_id,
      target_user_id
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

async function getVibeChecksByUsernameController(req, res) {
  const user_id = req.user.user_id
  const target_username = req.params.target_username

  try {
    const response = await VibeCheckService.getVibeChecksByUsername(
      user_id,
      target_username
    )
    return res.status(response.httpStatus).json({
      status: response.status,
      ...(response.data && { data: response.data }),
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

module.exports = {
  createVibeCheckController,
  getVibeCheckByIdController,
  getAllVibeChecksController,
  deleteVibeCheckController,
  likeOrDislikeController,
  getVibeChecksByUserIdController,
  getVibeChecksByUsernameController,
  createCommentController,
  deleteCommentController,
}
