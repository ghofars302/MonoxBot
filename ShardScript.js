const api = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');

const utils = require('./constructor/utils.js');
const ResourceLoader = require('./constructor/ResourceLoader.js')
const config = require('./config/BotCfg.json');
const auth = require('./config/auth.json');

class MonoxBot {
	constructor(){
		this.config = config;
		this.auth = auth;
		this.utils = new utils(this);
		this.ResourceLoader = new ResourceLoader(this);
		
		this.client = new api.Client({
			ownerID: this.config.owner,
			commandPrefix: this.config.defaultPrefix,
			disableEveryone: true,
			fetchAllMembers: true,
			unknownCommandResponse: false,
			nonCommandEditable: true,
			commandEditableDuration: 60000
		});
		this.ResourceLoader.loadModules();
		this.ResourceLoader.init();
		this.client.login(this.auth.BotToken);
	}
}

module.exports = new MonoxBot();