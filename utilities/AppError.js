class AppError extends Error {
    constructor(message, statusCode){
        super(); // calls/includes Error pairs
        this.message = message,
        this.statusCode = statusCode
    }
}

module.exports = AppError;