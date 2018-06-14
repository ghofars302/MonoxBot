require('colors');
const api = require('discord.js');
const config = require('./config/config.json');
const ResourceLoader = require('./const/ResourceLoader.js');
const messageHandler = require('./const/messageHandler.js');
const utils = require('./const/utils.js');
const Client = require('./const/Client.js');
const ConfirmHelper = require('./const/confirmationHelper.js');

process.on('unhandledRejection', (err) => {
	if (err.message && ['Missing Access', 'Missing Permissions'].some(x => err.message.includes(x))) return;
	console.error(`${'[ERR]'.red} Unhandled rejection:\n${(err && err.stack) || err}`); // eslint-disable-line no-console
});

class MonoxBot {
	constructor() {
		this.config = config;
		this.api = api;
		this.utils = utils;
		
		this.ResourceLoader = new ResourceLoader(this);
		this.messageHandler = new messageHandler(this);
		this.utils = new utils(this);
		this.ConfirmationHelper = new ConfirmHelper(this);
		this.db = this.ResourceLoader.createDBInstance();
		
		this.client = new Client({
			disableEveryone: true,
			fetchAllMembers: true,
			messageSweepInterval: 250,
			messageCacheLifetime: 250
		});
		
		this.ResourceLoader.loadEvents();
		this.ResourceLoader.loadModules();
		this.commands = this.ResourceLoader.loadCommands();
		
		this.commandCooldowns = new api.Collection();
		
		this.messageHandler.registerHandler();
		
		this.client.login(process.env.TOKEN);
	}
}

module.exports = new MonoxBot();