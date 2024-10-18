function errorResponse(httpStatus, message) {
    /**
     * utility function to handle errors
     * 
     * httpStatus - numeric type required
     * message - type string requried
     */

    // block checks that httpStatus is present
    if (!httpStatus) {
        throw new Error("Invalid httpStatus: required");
    }

    // block checks that httpStatus is a number
    if (typeof httpStatus !== "number") {
        throw new Error("Invalid httpStatus: must be a number")
    }

    // block checks that message is present
    if (!message) {
        throw new Error("Invalid message: required");
    }

    // block checks that message is a string
    if (typeof message !== "string") {
        throw new Error("Invalid message: must be a string")
    }

    // object creation
    const response = {
        httpStatus: httpStatus,
        message: message
    }

    return response;
}

module.exports = { errorResponse };