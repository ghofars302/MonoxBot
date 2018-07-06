const {Client} = require('discord.js');
const MonoxAPIError = require('../modules/MonoxAPIError');

class MonoxClient extends Client {
    constructor(options) {
        super(options);
        
        if (!options.owner || isNaN(options.owner)) throw new MonoxAPIError('Owner must be UserID or must not be empty'); 
        this.owner = options.owner || null;
        if (!options.prefix) throw new MonoxAPIError('Null or undefined is not a prefix');
        this.prefix = options.prefix;
    }

    async login(token) {
        try {
            await super.login(token);
        } catch (error) {
            throw new MonoxAPIError(`Unable to login into Discord API with provided TOKEN, \n${(error && error.stack) && error}}`);
        }
    } 
}

module.exports = MonoxClient;