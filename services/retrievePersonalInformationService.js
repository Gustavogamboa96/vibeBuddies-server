const { dataResponse } = require("../utils/dataResponse");
const userDAO = require("../repositories/userDAO");

async function retrievePersonalInformation(username) {
    /**
     * service layer function to handle the retrieving of profile information
     * 
     * username - valdiated by the auth middleware
     */
    try {
        const data = {}

        // searching for the user and extracting sensitive informaiton
        const returnedUser = await userDAO.getUserByUsername(username);

        // block checks if user is found found
        if (returnedUser.Count === 0) {
            data.message = `invalid - user ${username} not found`;
            return dataResponse(404, 'fail', data);
        }

        // extracting data needed
        const { Items } = returnedUser
        const { user_id, password, ...rest } = Items[0];

        // formatting the information that will be returned in the response
        data.user = {
            ...rest
        }

        return dataResponse(200, 'success', data)

    } catch (error) {
        throw error;
    }
}

module.exports = { retrievePersonalInformation }