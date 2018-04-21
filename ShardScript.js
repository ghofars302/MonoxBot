const Client = require('./const/MonoxClient.js');
const BotCfg = require('./config/BotCfg.json');

const { FriendlyError, SQLiteProvider } = require('discord.js-commando');

const path = require('path');
const sqlite = require('sqlite');

class bot {
	constructor() {
		this.config = BotCfg;
		this.utils = new utils(this);
		
		this.client = new Client({
			ownerID: this.config.owner,
			commandPrefix: this.config.defaultPrefix,
			disableEveryone: true,
			fetchAllMembers: true,
			unknownCommandResponse: false,
			nonCommandEditable: true,
			commandEditableDuration: 120
		});
		this.init();
		
		this.client.login(process.env.TOKEN);
	}
	
	onCmdError() {
		return (cmd, err, msg) => {
			if (err.message && ['Missing Access', 'Missing Permission'].some(x => err.message.includes(x))) return;
			if (err instanceof FriendlyError) return;
			throw msg.channel.send(':warning: **Command Error**, usually it is: SyntaxError or Module is not defined.```js\n' + err + '```')
				.then(msg.channel.stopTyping(true))
				.then(this.client.channels.get("432177642842750976").send('Command Error on command: ' + cmd.groupID + ':' + cmd.memberName + '```js\n' + err + '```'))
				.then(console.log((err && err.stack) || err));
		};
	}
	
	onUnhandledRejection() {
		return (err) => {
			if (err.message && ['Missing Access', 'Missing Permission'].some(x => err.message.includes(x))) return;
			console.log('[Shard ' + this.client.shard.id + '][Unhandled Rejection] ' + (err && err.stack) || err);
		};
	}

	onDisconnect() {
		return () => {
			console.log('[Bot Client] Aww, Disconnected from DISCORD Getaway.');
		};
	}
	
	onReconnect() {
		return () => {
			console.log('[Bot Client] Time to Reconnect and resume session');
		};
	}
	
	onReady() {
		return () => {
			console.log('[Bot Client] =======================');
			console.log('[Bot Client] Client Ready logged as');
			console.log('[Bot Client] Tag:' +  this.client.user.tag);
			console.log('[Bot Client] Id:' + this.client.user.id);
			console.log('[Bot Client] MonoxBot 1.0.0');
			console.log('[Bot Client] =======================');
			this.client.user.setActivity('m!help | 1.0.0', {
				type: "WATCHING"
			});
		};
	}
	
	init() {
		process.on('unhandledRejection', this.onUnhandledRejection());
		
		this.client
			.on('ready', this.onReady())
			.on('disconnect', this.onDisconnect())
			.on('reconect', this.onReconnect())
			.on('commandError', this.onCmdError())
			.on('warn', console.warn)
			.on('error', console.error)
			.on('debug', console.log);
		
		this.client.setProvider(sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new SQLiteProvider(db))).catch(console.error);
		
		this.client.registry
			.registerDefaultGroups()
			.registerGroups([
				['util', 'util'],
				['image', 'image'],
				['image-manipulation', 'image-manipulation'],
				['others', 'others'],
				['music', 'music']
			])
			.registerDefaultTypes()
			.registerDefaultCommands({
				ping: false,
				eval: false,
				help: false,
				commandState: false
			})
			.registerCommandsIn(path.join(__dirname, '/commands/'));
	}	
}

module.exports = new bot();