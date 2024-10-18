function dataResponse(httpStatus, status, data = {}) {
    /**
     * utility function to handle the creation of objects to return to controller
     * 
     * httpStatus: the http status of the response
     * status: this should contain 1 of 2, success or fail
     * data: optional - should include any data/message that should be sent back
     */

    // Set with the only possible statuses for the response
    const statuses = new Set(["success", "fail"]);

    status = status.trim().toLowerCase();

    // block checks for invalid data sets
    if (!data) {
        throw new Error("Invalid data: data set is invalid");
    }

    // block checks that httpStatus is present
    if (!httpStatus) {
        throw new Error("Invalid httpStatus: required");
    }

    // block checks that httpStatus is a number
    if (typeof httpStatus !== "number") {
        throw new Error("Invalid httpStatus: must be a number")
    }

    // block checks the validity of the status provided
    if (!status || !statuses.has(status)) {
        throw new Error("Invalid status: can only be success or fail");
    }

    // base response
    const response = {
        httpStatus: httpStatus,
        status: status
    };

    // block checks for the length of the data to add to response
    if (Object.keys(data).length !== 0) {
        response.data = data;
    }

    return response;
}

module.exports = { dataResponse };