const Context = require('./Context');
const argsPaser = require('./argsParser');
const commontags = require('common-tags');

require('./StructureExtends');

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

class messageHandler {
	constructor(bot) {
		this.bot = bot;

		this.context = new Context();
		this.argsPaser = new argsPaser(this);
	}

	async ContextCommand(context) {
		if (context.author.bot) return;

		if (!this.bot.utils.isAdmin(context.author.id)) {
			const isBlacklisted = await this.bot.utils.queryDB('SELECT FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [context.guild ? context.guild.id : context.channel.id, context.channel.id, context.author.id]);
			if (isBlacklisted.rowCount > 0) return;
		}

		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}>`);
		let prefix = context.prefix

		if (!context.content.startsWith(prefix) && !mentionRegex.test(context.content) && context.guild) return;

		const msgArguments = (mentionRegex.test(context.content) ? context.content.replace(mentionRegex, '') : context.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		let commandName = msgArguments.shift();	
		
		if (!commandName) return;
		commandName = commandName.toLowerCase();

		if (!this.bot.commands.has(commandName)) return;
		if (context.guild && !context.channel.permissionsFor(context.guild.me).has('SEND_MESSAGES')) return context.reply('Sorry, but I don\'t have permission to post in that channel!');
		if (context.guild && !context.channel.permissionsFor(context.guild.me).has('ATTACH_FILES')) return context.reply(':warning: ``MonoxBot require ATTACH_FILES to make most command working..``');
		if (context.guild && !context.channel.permissionsFor(context.guild.me).has('EMBED_LINKS')) return context.reply(':warning: ``MonoxBot require EMBED_LINKS to make most command working..``');

		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);
		if (command.adminOnly && !this.bot.utils.isAdmin(context.author.id)) return context.reply(':x: ``You don\'t have permission to use this command``');
		if (command.guildOnly && !context.guild) return context.reply(':x: ``Guild only command. please switch into guild to use this command``');
		if (this.bot.utils.isAdmin(context.author.id) && command.adminGuildOnly && !context.member.hasPermission('ADMINSTRATOR')) return context.reply(':x: ``only Guild adminstrator can use this command``');
		if (command.nsfw && !context.channel.nsfw) return context.reply(':x: ``NSFW Command. please switch into channel tagged as NSFW``'); 
		if (command.category === 'Voice') { 
			try {
				require('node-opus') || require('opusscript') // eslint-disable-line no-unused-expressions
			} catch (error) { 
				return context.reply(':x: `Voice command currently disabled`')
			}
		}
		
		if (!this.bot.utils.isAdmin(context.author.id)) {
			if (this.bot.commandCooldowns.has(context.author.id)) {

				const cooldowns = this.bot.commandCooldowns.get(context.author.id);

				if (cooldowns.has(command.name)) {
					const expirationTime = cooldowns.get(command.name);
					const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000) * 1000;

					if (Date.now() < expirationTime) {
						if (!cooldowns.has('handler:cooldown') || Date.now() > cooldowns.get('handler:cooldown')) context.reply(`:x: \`\`Cooldown! Please wait another ${this.bot.hd(timeRemaining)} before using this command\`\``);
						return cooldowns.set('handler:cooldown', Date.now() + 5000);
					}
				}

				cooldowns.set(command.name, Date.now() + command.cooldown);

			} else {
				const cooldowns = new this.bot.api.Collection();

				cooldowns.set(command.name, Date.now() + command.cooldown);

				this.bot.commandCooldowns.set(context.author.id, cooldowns);
			}
		}

		context.command = command;

		const args = await this.argsPaser.parseArgsCommand(msgArguments, context, command);
		if (!args) return;

		context.channel.startTyping();
		context.channel.stopTyping(true);

		try {
			this.bot.logger.log(this.bot.client, `${context.isDM ? `[DMChannel]` : `[GUILD ${context.guild.id}]`} [USER: ${context.author.tag} <${context.author.id}>] run command ${command.name}`);
			const output = await command.run.call(this.bot, context, args);

			if (typeof output === 'string' || output instanceof context.bot.api.MessageEmbed) {
				await context.reply(output);
			}
		} catch (error) { 
			context.error = true
			this.context.handleError(error, context);
		}

		if (!this.bot.utils.isAdmin(context.author.id)) this.bot.utils.queryDB('INSERT INTO commands VALUES ($1, $2, $3, $4, $5)', [context.id, command.name, context.author.id, context.channel.id, context.guild ? context.guild.id : context.channel.id]);
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

	async invalidArguments(context, reason) {
		if (!context.command) throw new Error('Invalid command object');
		if (!context.command.args || ['undefined'].includes(typeof context.command.args)) throw new Error('Invalid args object');
		if (!reason) reason = 'undefined';

		await context.reply(commontags.stripIndent`
			${reason}
			\`\`\`
			${context.prefix}${context.command.name} ${typeof context.command.args === 'object' ? context.command.args.pattern : context.command.args}
			${' '.repeat(context.prefix.length + context.command.name.length)} ${'^'.repeat(typeof context.command.args === 'object' ? context.command.args.pattern.length : context.command.args.length)}
			\`\`\`
		`)

		return false;
	}
}

module.exports = messageHandler;
