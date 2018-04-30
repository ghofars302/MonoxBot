const { FriendlyError } = require('discord.js-commando');

class init {
	constructor(base) {
		this.bot = base;
	}
	
	onReady() {
		return () => {
			console.log('[Bot Client] =======================');
			console.log('[Bot Client] Client Ready logged as');
			console.log('[Bot Client] Tag:' +  this.bot.client.user.tag);
			console.log('[Bot Client] Id:' + this.bot.client.user.id);
			console.log('[Bot Client] MonoxBot 1.0.0');
			console.log('[Bot Client] =======================');
			this.bot.client.user.setActivity('m!help | 1.0.0', {type: 'PLAYING'});
		};
	}
	
	onCMDError() {
		return (cmd, err, msg) => {
			if (err instanceof FriendlyError) {
				return;
			} else {
				throw msg.channel.send(`:warning: \`\`An error occurred while run command ${cmd.memberName}\`\` \`\`\`js\n${err}\`\`\``)
					.then(msg.channel.stopTyping())
			}
		}
	}
	
	onCMDBlocked() {
		return (msg, reason) {
			if (reason === 'thottling') {
				const throttle = msg.command.throttle(msg.author.id);
				const remaining = (throttle.start + (msg.command.throttling.duration * 1000) - Date.now()) / 1000;
				throw msg.channel.send(`:x: \`\`Cooldown, please wait ${remaining.toFixed(1)} sec\`\``);
			} else if (reason === 'guildOnly') {
				throw msg.channel.send(':x: ``Guild only command. please switch channel into guild channel.``');
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
	
	onMessage() {
		return (msg) => {
			if (!msg.channel.permissionsFor(this.bot.user.id).has('SEND_MESSAGES')) return msg.reply('Sorry, but i need SEND_MESSAGES permission on channel where you execute command.');
			if (!msg.channel.permissionsFor(this.bot.user.id).has('ATTACH_FILES')) return msg.channel.send(':warning: MonoxBot require the folowing permission(s) ```ATTACH_FILES```');
		}
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

module.exports = init;