const updatePasswordService = require("../services/updatePasswordService");

async function updatePasswordController(req, res){
    const username = req.user.username;
    const {currentPassword, newPassword} = req.body

    try{
        const response = await updatePasswordService.updatePassword(username, currentPassword, newPassword);
        return res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data })
        });
    } catch(error) {
        res.status(401).json({ message: error.message });
      }
}

module.exports = {updatePasswordController};