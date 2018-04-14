const { FriendlyError, SQLiteProvider } = require('discord.js-commando');
const sq = require('sqlite');

class ResourceLoader {
	constructor(MonoxBot) {
		this.MonoxBot = MonoxBot;
	}
	
	loadModules() {
		this.MonoxBot.client.ytdl = require('ytdl-core');
		this.MonoxBot.client.booru = require('booru');
		this.MonoxBot.client.jimp = require('jimp');
		this.MonoxBot.client.puppeteer = require('puppeteer');
	}
	
	init() {
		process.on('unhandledRejection', this.onUnhandledRejection());
		this.MonoxBot.client.on('commandError', this.onCmdError())
		this.MonoxBot.client.on('ready', this.onReady());
		this.MonoxBot.client.on('disconnect', this.onDisconnect());
		this.MonoxBot.client.on('reconnect', this.onReconnect());
		this.MonoxBot.client.on('warn', console.warn);
		this.MonoxBot.client.on('debug', console.log);
		this.MonoxBot.client.on('error', console.error);
		
		this.MonoxBot.client.utils = this.MonoxBot.utils;
		
		this.MonoxBot.client.setProvider(sq.open('../database/database.sqlite3')).then(db => new SQLiteProvider(db)).catch(console.error);
		
		this.client.registry
			.registerDefaultGroups()
			.registerGroup([
				['util', 'util'],
				['image', 'image'],
				['image-manipulation', 'image-manipulation']
			])
			.registerDefaultTypes()
			.registerDefaultCommands({
				ping: false,
				eval_: false,
				commandState: false,
				help: false
			})
			.registerCommandIn('../commands/');
	}
	
	onCmdError() {
		return (err, cmd, err) => {
			if (err.message && ['Missing Access', 'Missing Permission'].some(x => err.message.includes(x))) return;
			if (err instanceof FriendlyError) return;
			throw msg.channel.send()
				.then(msg.channel.stopTyping(true))
				.then(this.MonoxBot.client.channels.get(this.MonoxBot.config.ReportChannel));
		};
	}
	
	onUnhandledRejection() {
		return (err) => {
			if (err.message && ['Missing Access', 'Missing Permission'].some(x => err.message.includes(x)) return;
			console.log('[Unhandled Promise Rejection] ' + (err && err.stack) || err);
		};
	}
	
	onReady() {
		return () => {
			console.log('[Bot Client] =======================');
			console.log('[Bot Client] Client Ready logged as');
			console.log('[Bot Client] Tag:' +  this.MonoxBot.client.user.tag);
			console.log('[Bot Client] Id:' + this.MonoxBot.client.user.id);
			console.log('[Bot Client] MonoxBot 1.0.0');
			console.log('[Bot Client] =======================');
			this.MonoxBot.client.user.setActivity('m!help | 1.0.0', {
				type: "WATCHING"
			});
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
}

module.exports = ResourceLoader;