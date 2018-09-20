class ExtendableError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error thrown if an unhandled exception occurres
 */
class UnhandledMoodleError extends ExtendableError {
    /**
     * Create a new unhandled error
     * @param {String} message - The message to be displayed to the console
     * @param err - The error object to be thrown
     */
    constructor(message, err) {
        super(`Unhandled Moodle error occurred: ${message}`);
        this.data = {message, err}
    }

}

module.exports = {
    UnhandledMoodleError
}