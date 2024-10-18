function capitalizeFirstLetterEveryWord(string) {
    /**
     * utility function to capitalize the first letter of every word in a string
     * 
     * string is expected
     */

    // splitting the string into an array
    const cityName = string.split(" ");
    // block capitalized the first letter of each element in array
    cityName.forEach((value, index, array) => {
        value = value[0].toUpperCase() + value.slice(1);
        array[index] = value;
    })
    // rejoining the string
    return cityName.join(" ");
}

module.exports = { capitalizeFirstLetterEveryWord }