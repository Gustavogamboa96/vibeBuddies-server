const { dataResponse } = require("../utils/dataResponse");
const userDAO = require("../repositories/userDAO");

async function retrieveUserByUsername(username) {
    /**
     * service layer function to handle the searching of users
     * 
     * username - required in the body of the request
     */

    try {
        const data = {}

        // block to valdiate username
        if (!username || typeof username !== "string") {
            data.message = `invalid - username of type string is required`;
            return dataResponse(400, 'fail', data);
        }

        // searching for the user and extracting sensitive informaiton
        const returnedUser = await userDAO.getUserByUsername(username);

        // block checks if user is not found found
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

module.exports = { retrieveUserByUsername }