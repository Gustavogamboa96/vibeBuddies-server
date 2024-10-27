const VibeCheckService = require("../services/vibeCheckService")
const dao = require("../repositories/vibeCheckDAO")
const userDao = require("../repositories/userDAO")
const { dataResponse } = require("../utils/dataResponse")

jest.mock("../repositories/vibeCheckDAO")
jest.mock("../repositories/userDAO")

describe("createComment", () => {
  const user_id = "123"
  const username = "testUser"
  const vibe_check_id = "456"
  const comment_body = "This is a test comment"

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("should return 404 if vibeCheck does not exist", async () => {
    dao.getItemById.mockResolvedValue(null)

    const response = await VibeCheckService.createComment(
      user_id,
      username,
      vibe_check_id,
      comment_body
    )

    expect(response).toEqual(
      dataResponse(404, "fail", { message: "VibeCheck does not exist" })
    )
  })

  test("should return 404 if user does not exist", async () => {
    dao.getItemById.mockResolvedValue({ Item: { vibe_check_id } })
    userDao.findUserById.mockResolvedValue(null)

    const response = await VibeCheckService.createComment(
      user_id,
      username,
      vibe_check_id,
      comment_body
    )

    expect(response).toEqual(
      dataResponse(404, "fail", { message: "User does not exist" })
    )
  })

  test("should return 201 if comment is created successfully", async () => {
    dao.getItemById.mockResolvedValue({ Item: { vibe_check_id } })
    userDao.findUserById.mockResolvedValue({ Item: { user_id } })
    dao.addCommentToVibeCheck.mockResolvedValue(true)

    const response = await VibeCheckService.createComment(
      user_id,
      username,
      vibe_check_id,
      comment_body
    )

    expect(response).toEqual(
      dataResponse(201, "success", { message: "Comment created successfully" })
    )
  })

  test("should return 500 if adding comment fails", async () => {
    // Mock DAO and userDao to simulate failure in adding comment
    dao.getItemById.mockResolvedValue({ Item: { vibe_check_id } })
    userDao.findUserById.mockResolvedValue({ Item: { user_id } })
    dao.addCommentToVibeCheck.mockRejectedValue(new Error("DynamoDB error"))

    const response = await VibeCheckService.createComment(
      user_id,
      username,
      vibe_check_id,
      comment_body
    )

    expect(response).toEqual(
      dataResponse(500, "fail", {
        message: "failed to confirm vibeChecks existence",
      })
    )
  })
})
