const { errorResponse } = require("../utils/errorResponse");
const { retrievePersonalInformation } = require("../services/retrievePersonalInformationService");

async function getPersonalInformation(req, res) {
    /**
     * controller layer function to get the users personal information
     * 
     */
    try {

        // extracting needed information
        const { username } = req.user;

        // calling service layer function to retrieve personal information for the profile
        const response = await retrievePersonalInformation(username);

        // responding to client with object data
        return res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data })
        });
    } catch (error) {
        console.log(error.message);
        const response = errorResponse(500, "Internal server error during loggin");
        res.status(response.httpStatus).json({
            message: response.message
        });
    }
}

module.exports = { getPersonalInformation }