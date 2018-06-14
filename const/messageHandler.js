const ContextMessage = require('./Context.js');
const blacklist = require('../config/blacklist.json');
require('./StructureExtends');

class messageHandler {
	constructor(bot) {
		this.bot = bot;

		Array.prototype.random = function() {
			return this[Math.floor(Math.random() * this.length)];
		};

		Array.prototype.remove = function() {
			var what, a = arguments, L = a.length, ax;
			while (L && this.length) {
				what = a[--L];
				while ((ax = this.indexOf(what)) !== -1) {
					this.splice(ax, 1);
				}
			}
			return this;
		};		
		
		String.prototype.toProperCase = function() {
			return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
	}
	
	registerHandler() {
		this.bot.client.on('message', (msg) => {
			this.messageCommand(msg);
		});
		
		this.bot.client.on('messageUpdate', (oldMsg, newMsg) => {
			if (oldMsg.content === newMsg.content) return;
			this.messageCommand(newMsg);
		});
	}
	
	async messageCommand(msg) {
		if (msg.author.bot) return;

		if (require.cache[require.resolve('../config/blacklist.json')]) delete require.cache[require.resolve('../config/blacklist.json')];

		const {UserID} = require('../config/blacklist.json');
		const userIDArray = Array.from(UserID);
		

		const ctx = new ContextMessage(this.bot, this.bot.client, msg);

		let prefix = this.bot.config.prefix;
		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}>`);

		if (!msg.content.startsWith(prefix) && !mentionRegex.test(msg.content) && msg.guild) return;
		
		const msgArguments = (mentionRegex.test(msg.content) ? msg.content.replace(mentionRegex, '') : msg.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		let commandName = msgArguments.shift();
		
		if (!commandName) return;
		commandName = commandName.toLowerCase();
		
		if (!this.bot.commands.has(commandName)) return;
		if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return msg.author.send('Sorry, but I don\'t have permission to post in that channel!');
		if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('ATTACH_FILES')) return msg.channel.send(':warning: ``MonoxBot require ATTACH_FILES to make most command working..``');
		if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) return msg.channel.send(':warning: ``MonoxBot require EMBED_LINKS to make most command working..``');
		
		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);
		if (command.adminOnly && !this.bot.utils.isAdmin(msg.author.id)) return msg.channel.send(':x: ``You don\'t have permission to use this command``');
		if (command.guildOnly && !msg.guild) return msg.channel.send(':x: ``Guild only command. please switch into guild to use this command``');
		if (command.nsfw && !msg.channel.nsfw) return msg.channel.send(':x: ``NSFW Command. please switch into channel tagged as NSFW``');
		if (userIDArray.includes(msg.author.id) && this.bot.commands.has(commandName)) return msg.react('❌');
		
		if (!this.bot.utils.isAdmin(msg.author.id)) {
			if (command.adminGuildOnly && !msg.member.hasPermission('ADMINSTRATOR')) return msg.channel.send(':x: ``only Guild adminstrator can use this command``');
			if (this.bot.commandCooldowns.has(msg.author.id)) {

				const cooldowns = this.bot.commandCooldowns.get(msg.author.id);

				if (cooldowns.has(command.name)) {
					const expirationTime = cooldowns.get(command.name);
					const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000) * 1000;

					if (Date.now() < expirationTime) {
						if (!cooldowns.has('handler:cooldown') || Date.now() > cooldowns.get('handler:cooldown')) msg.channel.send(`:x: \`\`Cooldown! Please wait another ${this.bot.hd(timeRemaining)} before using this command\`\``);
						return cooldowns.set('handler:cooldown', Date.now() + 5000);
					}
				}

				cooldowns.set(command.name, Date.now() + command.cooldown);

			} else {
				const cooldowns = new this.bot.api.Collection();

				cooldowns.set(command.name, Date.now() + command.cooldown);

				this.bot.commandCooldowns.set(msg.author.id, cooldowns);
			}
		}
		
		const unsplitArgs = msgArguments.join(' ');
		const splitArgs = this.splitArguments(unsplitArgs);
		
		msg.channel.startTyping();
		msg.channel.stopTyping(true);
		
		command.run.call(this.bot, ctx, splitArgs, unsplitArgs).catch((err) => {
			this.bot.utils.handleCommandError(err, msg);
		});

		this.bot.utils.queryDB('INSERT INTO commands VALUES ($1, $2, $3, $4, $5)', [msg.id, command.name, msg.author.id, msg.channel.id, msg.guild ? msg.guild.id : msg.channel.id]);
	}
	
	splitArguments(string) {
		const splitArguments = string.trim().split('');

		const args = [];
		let inMultiwordArg = false;
		let currentArg = '';

		for (const char of splitArguments) {

			if (char === '"') {
				inMultiwordArg = !inMultiwordArg;
			} else if (char === ' ' && !inMultiwordArg && currentArg) {
				args.push(currentArg);
				currentArg = '';
			} else if (char !== ' ' || inMultiwordArg) currentArg += char;

		}

		if (currentArg) args.push(currentArg);

		return args;
	}

	async invalidArguments(msg) {
		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}> `);
		let prefix = this.bot.config.prefix;

		const messageArguments = (mentionRegex.test(msg.content) ? msg.content.replace(mentionRegex, '') : msg.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		const commandName = messageArguments.shift().toLowerCase();
		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);

		msg.channel.send({embed: {
			title: 'Invalid arguments! Try:',
			description: `\`\`\`\n${prefix}${commandName} ${command.args || ''}\`\`\``,
			color: 15158332
		}});
	}
}

module.exports = messageHandler;