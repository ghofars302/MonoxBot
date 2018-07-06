module.exports = class MonoxAPIError extends Error {
    constructor(reason) {
        super(reason);
        this.name = 'MonoxAPIError';
    }
}