function createError(status, message) {
    var err = new Error(message);
    err.status = status;
    return err;
}

module.exports = function() {
    Error.create = createError;
}