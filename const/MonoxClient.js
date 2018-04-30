const { CommandoClient } = require('discord.js-commando');

class MonoxClient extends CommandoClient {
	constructor(options) {
		super(options);
	}
}

module.export = MonoxClient;