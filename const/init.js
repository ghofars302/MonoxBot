/*
* @Client init on MonoxBot classes.
* base => MainClientClass
*/

const { FriendlyError } = require('discord.js-commando');

class init {
	constructor(base) {
		this.bot = base;
	}
	
	onReady() {
		let version = require('../package.json')['version'];
		return () => {
			console.log('[Bot Client] =======================');
			console.log('[Bot Client] Client Ready logged as');
			console.log('[Bot Client] Tag:' +  this.bot.client.user.tag);
			console.log('[Bot Client] Id:' + this.bot.client.user.id);
			console.log('[Bot Client] MonoxBot ' + version);
			console.log('[Bot Client] =======================');
			this.bot.client.user.setActivity('m!help | ' + version, {type: 'PLAYING'});
		};
	}
	
	onCMDError() {
		return (cmd, err, msg) => {
			if (err instanceof FriendlyError) {
				return;
			} else if (err.name === 'FetchError') {
				throw msg.channel.send('⚠ ``API service unavailable or took too long.``'); 
			} else {
				throw msg.channel.send(`⚠ \`\`An error occurred while run command ${cmd.memberName}\`\` \`\`\`js\n${err}\`\`\``);
			}
		}
	}
	
	onCMDBlocked() {
		return (msg, reason) => {
			if (reason === 'throttling') {
				const throttle = msg.command.throttle(msg.author.id);
				const remaining = (throttle.start + (msg.command.throttling.duration * 1000) - Date.now()) / 1000;
				throw msg.channel.send(`❌ \`\`Cooldown, please wait another ${remaining.toFixed(1)} sec before use this command again.\`\``)
			} else if (reason === 'guildOnly') {
				throw msg.channel.send('❌ ``Guild only command. Please switch channel into Guild channel.``');
			} else if (reason === 'permission') {
				throw msg.channel.send('❌ ``You don\'t have permission to run this command.``');
			} else if (reason === 'nsfw') {
				throw msg.channel.send('❌ ``NSFW, Please switch into text channel tagged as NSFW.``');
			}
		}
	}

	onUnhandledRejection() {
		return (err) => {   
			if (err.message && ['Missing Access', 'Missing Permission'].some(x => err.message.includes(x))) return;
			console.log('[Shard ' + this.bot.client.shard.id + '][Unhandled Rejection] ' + (err && err.stack) || err);
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
	
	
	loadEveything() {
		process.on('unhandledRejection', this.onUnhandledRejection());
		this.bot.client.on('commandError', this.onCMDError())
			.on('commandBlocked', this.onCMDBlocked())
			.on('error', console.error)
			.on('debug', console.log)
			.on('warn', console.warn)
			.on('ready', this.onReady())
			.on('disconnect', this.onDisconnect())
			.on('reconnect', this.onReconnect());
		
		this.bot.client.registry
			.registerDefaultGroups()
			.registerGroups([
				['util', 'util'],
				['image-manipulation', 'image-manipulation'],
				['others', 'others'],
				['weeb', 'weeb'],
				['nsfw', 'nsfw'],
				['music', 'music'],
				['osu', 'osu']
			])
			.registerDefaultTypes()
			.registerDefaultCommands({
				ping: false,
				eval: false,
				help: false,
				prefix: false,
				commandState: false
			})
	}
}

module.exports = init;