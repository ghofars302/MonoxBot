const {Client} = require('discord.js');

class MonoxClient extends Client {
    constructor(options) {
        super(options);
    }
}

module.exports = MonoxClient;