const Context = require('./Context');
const blacklist = require('../config/blacklist.json'); // eslint-disable-line no-unused-vars
require('./StructureExtends');

class messageHandler {
	constructor(bot) {
		this.bot = bot;

		this.context = new Context();

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

	async ContextCommand(ctx) {
		if (ctx.author.bot) return;

		if (!this.bot.utils.isAdmin(ctx.author.id)) {
			if (require.cache[require.resolve('../config/blacklist.json')]) delete require.cache[require.resolve('../config/blacklist.json')];
			const {UserID} = require('../config/blacklist.json');
			const userIDArray = Array.from(UserID);

			if (userIDArray.includes(ctx.author.id)) return;
		}

		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}>`);
		let prefix = this.bot.config.prefix;

		if (!ctx.content.startsWith(prefix) && !mentionRegex.test(ctx.content) && ctx.guild) return;

		const msgArguments = (mentionRegex.test(ctx.content) ? ctx.content.replace(mentionRegex, '') : ctx.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		let commandName = msgArguments.shift();	
		
		if (!commandName) return;
		commandName = commandName.toLowerCase();

		if (!this.bot.commands.has(commandName)) return;
		if (ctx.guild && !ctx.channel.permissionsFor(ctx.guild.me).has('SEND_MESSAGES')) return ctx.reply('Sorry, but I don\'t have permission to post in that channel!');
		if (ctx.guild && !ctx.channel.permissionsFor(ctx.guild.me).has('ATTACH_FILES')) return ctx.reply(':warning: ``MonoxBot require ATTACH_FILES to make most command working..``');
		if (ctx.guild && !ctx.channel.permissionsFor(ctx.guild.me).has('EMBED_LINKS')) return ctx.reply(':warning: ``MonoxBot require EMBED_LINKS to make most command working..``');

		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);
		if (command.adminOnly && !this.bot.utils.isAdmin(ctx.author.id)) return ctx.reply(':x: ``You don\'t have permission to use this command``');
		if (command.guildOnly && !ctx.guild) return ctx.reply(':x: ``Guild only command. please switch into guild to use this command``');
		if (this.bot.utils.isAdmin(ctx.author.id) && command.adminGuildOnly && !ctx.member.hasPermission('ADMINSTRATOR')) return ctx.reply(':x: ``only Guild adminstrator can use this command``');
		if (command.nsfw && !ctx.channel.nsfw) return ctx.reply(':x: ``NSFW Command. please switch into channel tagged as NSFW``');

		if (!this.bot.utils.isAdmin(ctx.author.id)) {
			if (this.bot.commandCooldowns.has(ctx.author.id)) {

				const cooldowns = this.bot.commandCooldowns.get(ctx.author.id);

				if (cooldowns.has(command.name)) {
					const expirationTime = cooldowns.get(command.name);
					const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000) * 1000;

					if (Date.now() < expirationTime) {
						if (!cooldowns.has('handler:cooldown') || Date.now() > cooldowns.get('handler:cooldown')) ctx.reply(`:x: \`\`Cooldown! Please wait another ${this.bot.hd(timeRemaining)} before using this command\`\``);
						return cooldowns.set('handler:cooldown', Date.now() + 5000);
					}
				}

				cooldowns.set(command.name, Date.now() + command.cooldown);

			} else {
				const cooldowns = new this.bot.api.Collection();

				cooldowns.set(command.name, Date.now() + command.cooldown);

				this.bot.commandCooldowns.set(ctx.author.id, cooldowns);
			}
		}

		const unsplitArgs = msgArguments.join(' ');
		const splitArgs = this.splitArguments(unsplitArgs);

		ctx.channel.startTyping();
		ctx.channel.stopTyping(true);

		try {
			console.log(`[SHARD ${ctx.main.shard.id}] ${ctx.isDM() ? `[DMChannel]` : `[GUILD ${ctx.guild.id}]`} [USER: ${ctx.author.tag} <${ctx.author.id}>] run command ${command.name}`) // eslint-disable-line no-console
			const output = await command.run.call(this.bot, ctx, splitArgs, unsplitArgs);

			if (typeof output === 'string' || output instanceof ctx.bot.api.MessageEmbed) {
				await ctx.reply(output);
			}
		} catch (error) {
			this.context.handleError(error, ctx);
		}

		if (!this.bot.utils.isAdmin(ctx.author.id)) this.bot.utils.queryDB('INSERT INTO commands VALUES ($1, $2, $3, $4, $5)', [ctx.id, command.name, ctx.author.id, ctx.channel.id, ctx.guild ? ctx.guild.id : ctx.channel.id]);
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

	async invalidArguments(context) {
		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}> `);
		let prefix = this.bot.config.prefix;

		const messageArguments = (mentionRegex.test(context.content) ? context.content.replace(mentionRegex, '') : context.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		const commandName = messageArguments.shift().toLowerCase();
		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);

		context.reply(`\`\`\`${this.bot.config.prefix}${commandName} ${command.args}\n${command.description}\`\`\``);
	}
}

module.exports = messageHandler;