const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

async function deleteUser(username, userId) {
    /**
     * service layer function to handle the deletion of a user based on their id
     * 
     * username - grabbed from the auth middleware
     * userId - grabbed from the auth middleware
     */


    try {
        const response = await userDAO.deleteUserById(username);
        const data = {}

        // block to check we get back some response
        if (!response) {
            data.message = "Sorry something went wrong.";
        }

        data.message = `${username} deleted successfully`;

        return dataResponse(204, "success", data);

    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = { deleteUser }