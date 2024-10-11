const { dataResponse } = require("../utils/dataResponse");
const { capitalizeFirstLetterEveryWord } = require("../utils/capitalizeFirstLetterEveryWord");

function dataValidation(req, res, next) {
    /**
     * middleware function to handle valdiating the request body params that need to be changed
     * 
     * certain params are extracted to prevent them from being updated
     */
    const dataToUpdate = {};
    const dataToDelete = {};

    // set for valid parameters that can be changed
    const validFields = new Set([
        "favoriteSong",
        "favoriteArtist",
        "favoriteAlbum",
        "city",
        "state",
        "country",
        "bio"
    ])
    // destructuring information that can't be changed through this
    // destructuring bodyData which are values that can be changed
    const { ...bodyData } = req.body;

    // block trims data, updates whichs fields need to changed
    Object.entries(bodyData).forEach(([key, value]) => {
        // checking if the key provided is a key that is allowed to change
        if (validFields.has(key) && typeof value === "string") {
            dataToUpdate[key] = value.trim();
            validFields.delete(key);
        }
    })

    // blcok checks which fields need to be deleted
    validFields.forEach(value => {
        dataToDelete[value] = null;
    });

    // update the request body to hold the new information for which data to update and which to delete
    req.dataToUpdate = dataToUpdate;
    req.dataToDelete = dataToDelete;

    next();
}


module.exports = { dataValidation }