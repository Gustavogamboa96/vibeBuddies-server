const AWS = require("aws-sdk");
const userDAO = require("../repositories/userDAO");
const { dataResponse } = require("../utils/dataResponse");

// intsance
const s3 = new AWS.S3();

async function uploadImageService(username, file) {
    /**
     * service layer function to handle the creation of a profile image in the bucket
     */

    try {
        const s3Params = {
            // chose to hard code the bucket name since it only stores user images, in a bigger project would store in .env
            // Bucket: process.env.AWS_BUCKET_NAME,
            Bucket: "vibebuddies-profileimages",
            Key: `profileImages/${username}-${Date.now()}`,
            Body: file.buffer,
            // ContentType: file.mimetype
        };

        // sotring the image in the bucket
        const s3Upload = await s3.upload(s3Params).promise();
        const profileImageUrl = s3Upload.Location;
        // storing the profileImage in the URL
        await userDAO.updateProfileImage(username, profileImageUrl);

        return dataResponse(200, "success", { profileImageUrl });
    } catch (error) {
        throw new Error("Failed to upload image: " + error.message);
    }
}

module.exports = { uploadImageService };