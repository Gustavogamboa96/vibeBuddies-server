const { uploadImageService } = require("../services/uploadImageService");
const { errorResponse } = require("../utils/errorResponse");

async function uploadImageController(req, res) {
    /**
     * controller layer function to handle the uploading of a profile image
     * 
     */
    try {
        // destructuring required params
        const { file } = req;
        const { username } = req.user;

        const response = await uploadImageService(username, file);

        return res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data })
        });

    } catch (error) {
        console.log(error.message);
        const response = errorResponse(500, "Internal server error during profile update");
        return res.status(response.httpStatus).json({
            message: response.message
        });
    }
}

module.exports = { uploadImageController };