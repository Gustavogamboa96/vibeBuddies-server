const { updateProfile: updateProfileService } = require("../services/updateProfileService.js");
const { errorResponse } = require("../utils/errorResponse.js");

async function updateProfile(req, res) {
    /**
     * controller layer function to handle the updating of user info
     * 
     * req.body - for now can contain any kind of information
     * req.user - should contain information about the user, stored by the authentication middleware for the JWT
     */


    try {
        // destructuring required fields
        const { ...dataToUpdate } = req.dataToUpdate;
        const { ...dataToDelete } = req.dataToDelete;
        const { username } = req.user;

        // passing info into our service layer funciton
        const response = await updateProfileService(username, dataToUpdate, dataToDelete);

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


module.exports = { updateProfile };