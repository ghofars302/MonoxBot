/*
* @Copyright 2018 ghofars302
*
* @name {MonoxBot} The base file of MonoxBot 1.0.0
*
*/

if (process.version.slice(1).split(".")[0] < 9) throw new Error('MonoxBot require Node version 9.x.x or newer, Update your node.js now');

const { SQLiteProvider } = require('discord.js-commando');

const Client = require('./const/MonoxClient.js');
const init = require('./const/init.js');
const config = require('./config/BotCfg.json');
const sqlite = require('sqlite');
const path = require('path');

class MonoxBot {
	constructor() {
		this.config = config;
		
		this.client = new Client({
			owner: this.config.owner,
			commandPrefix: this.config.defaultPrefix,
			disableEveryone: true,
			fetchAllMembers: true,
			unknownCommandResponse: false,
			nonCommandEditable: true,
			commandEditableDuration: 120
		});
		this.init = new init(this);
		
		this.init.loadEveything();
 	    this.client.registry.registerCommandsIn(path.join(__dirname, '/commands/'));
		this.client.setProvider(sqlite.open(path.join(__dirname, 'BotSetting.sqlite3')).then(db => new SQLiteProvider(db))).catch(console.error);
		
		this.client.login(process.env.TOKEN);
	}
}

new MonoxBot();