function updateProfileSettings(dataToUpdate, dataToDelete) {
    /**
     * utility function to create my update settings in the service layer for updating a profile
     * the updateSetting is then passed into the DAO function
     */

    // object to hold the settings that will be put into the update params
    let updateSettings = {}
    updateSettings.ExpressionAttributeNames = {}
    updateSettings.ExpressionAttributeValues = {}
    updateSettings.removeString = "";
    updateSettings.setString = "";

    // block checks if there are any items that need to be udpated
    if (Object.keys(dataToUpdate).length > 0) {
        // creating a new set string
        let setString = "SET ";

        // iterating through the object to create the string
        Object.entries(dataToUpdate).forEach(([key, value]) => {
            setString += `#${key} = :${key}, `;
            updateSettings.ExpressionAttributeNames[`#${key}`] = `${key}`;
            updateSettings.ExpressionAttributeValues[`:${key}`] = value;
        })

        // removing the trailing comma
        setString = setString.slice(0, setString.length - 2);

        updateSettings.setString = setString;

    }

    // block checks if there are attributes to be deleted
    if (Object.keys(dataToDelete).length > 0) {
        // creating the removing string
        let removeString = "REMOVE ";

        // iterating through the object to create the string
        Object.entries(dataToDelete).forEach(([key, value]) => {
            removeString += `#${key}, `;
            updateSettings.ExpressionAttributeNames[`#${key}`] = `${key}`;
        })

        // removing the trailing comma
        removeString = removeString.slice(0, removeString.length - 2);

        updateSettings.removeString = removeString;

    }

    return updateSettings;
}

module.exports = { updateProfileSettings }