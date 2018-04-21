const { Client } = require('discord.js-commando')

class MonoxClient extends Client {
	constructor(options) {
		super(options)
	}
}

module.exports = MonoxClient;