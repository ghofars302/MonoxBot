const {Client} = require('discord.js');
const MonoxAPIError = require('../modules/MonoxAPIError');

class MonoxClient extends Client {
    constructor(options, bot) {
        super(options);
        
        this.owner = options.owner || '';
        if (!options.prefix) throw new MonoxAPIError('Null or undefined is not a prefix');
        this.prefix = options.prefix;

        this.bot = bot;
    }

    async login(token) {
        try {
            return await super.login(token);
        } catch (error) {
            throw new MonoxAPIError(`Unable to login into Discord API with provided TOKEN, \n${(error && error.stack) && error}}`);
        }
    } 
}

module.exports = MonoxClient;
