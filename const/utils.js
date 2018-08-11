const Bluebird = require('bluebird');

class utils {
	constructor(bot) {
		this.bot = bot;
	}
	
	filterMentions(string) {

		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if ((UID || NID) && this.bot.client.users.has(UID || NID)) return `@${this.bot.client.users.get(UID || NID).username}`;
			if (CID && this.bot.client.channels.has(CID)) return `#${this.bot.client.channels.get(CID).name}`;

			if (RID)
				for (const server of this.bot.client.guilds.values())
					if (server.roles.has(RID)) return `@${server.roles.get(RID).name}`;

			if (CID) return '#deleted-channel';
			if (RID) return '@deleted-role';
			return '@invalid-user';
		});

  	}

	isAdmin(userID) {
		return this.bot.config.admins.includes(userID);
	}

	ImageEmbedPagination(ctx, array, message, fieldTitle, fieldMessage) {
		if (fieldTitle && !fieldMessage) throw new Error('Embed filed value must not empty');

		let page = [];
		let pageNumber = 0;
		page.push('EMBED#UNDEFINED');

		
		for (const items of array) {
			const embed = new ctx.bot.api.MessageEmbed();
			if (message) embed.setDescription(message);
			if (fieldTitle && fieldMessage) embed.addField(fieldTitle, fieldMessage)
			embed.setImage(items);

			if (array.length > 1) {
				pageNumber = pageNumber + 1; // eslint-disable-line operator-assignment
				embed.setFooter(`Page ${pageNumber} of ${array.length}`);
			} else {
				embed.setFooter(`Page 1 of 1`);
			}

			page.push(embed);
		}

		return page;
	} 
	
	childExec(code) { 
		return new Bluebird((resolve, reject) => { 
			require('child_process').exec(code, {timeout: 30}, function (err, stdout, stderr) { 
				if (err) reject(err || stderr); 
				resolve(stdout)
			});
		});
		
	}

	async getImagesFromMessage(msg, args) {
		let imageURLs = [];

		for (const attachment of msg.attachments.values()) imageURLs.push(attachment.url);
		if (args[0] !== '^')
			for (const value of args) {
				if (this.isURL(value)) imageURLs.push(value);

				if (/^<a?:.+:\d+>$/.test(value)) {
					imageURLs.push(`https://cdn.discordapp.com/emojis/${value.match(/^<a?:.+:(\d+)>$/)[1]}`);
				} else {
					if (value === 'me') {
						if (msg.author.displayAvatarURL().endsWith('.gif')) {
							imageURLs.push(msg.author.displayAvatarURL({
								format: 'gif',
								size: 1024
							}));
							continue;
						} else {
							imageURLs.push(msg.author.displayAvatarURL({
								format: 'png',
								size: 1024
							}));
							continue;
						}
					}

					if (!msg.guild) {
						if (msg.author.tag.toLowerCase().includes(value.toLowerCase()) || msg.author.id === value.replace(/[^\d]/g, '')) {
							if (msg.author.displayAvatarURL().endsWith('.gif')) {
								imageURLs.push(msg.author.displayAvatarURL({
									format: 'gif',
									size: 1024
								}));
								continue;
							} else {
								imageURLs.push(msg.author.displayAvatarURL({
									format: 'png',
									size: 1024
								}));
								continue;
							}
						}
					}

					const match = this.getMemberFromString(msg, value);
					if (match) {
						if (match.user.displayAvatarURL().endsWith('.gif')) {
							imageURLs.push(match.user.displayAvatarURL({
								format: 'gif',
								size: 1024
							}));
						} else {
							imageURLs.push(match.user.displayAvatarURL({
								format: 'png',
								size: 1024
							}));
						}
					}
				}
			}
		if (imageURLs.length === 0) {
			const messages = await msg.channel.messages.fetch({
				limit: 20
			});

			const messageAttachments = messages.filter(m => m.attachments.size > 0 && m.attachments.first().height && m.attachments.first().width);
			const linkEmbeds = messages.filter(m => m.embeds.length > 0 && m.embeds[0].type === 'image');
			const messageEmbeds = messages.filter(m => m.embeds.length > 0 && m.embeds[0].image);
			let images = [];

			for (const messageAttachment of messageAttachments.array()) images.push({
				url: messageAttachment.attachments.first().url,
				createTimestamp: messageAttachment.createTimestamp
			});

			for (const linkEmbed of linkEmbeds.array()) images.push({
				url: linkEmbed.embeds[0].url,
				createTimestamp: linkEmbed.createTimestamp
			});

			for (const messageEmbed of messageEmbeds.array()) images.push({
				url: messageEmbed.embeds[0].image.url,
				createTimestamp: messageEmbed.createTimestamp
			});

			images = images.sort((m1, m2) => m2.createTimestamp - m1.createTimestamp);
			imageURLs = images.map(i => i.url);
		}
		return imageURLs;
	}

	getMemberFromString(msg, text) {
		if (!text) return;
		let mostRecentTimestamp = 0;
		let match;

		for (const member of msg.guild.members.array()) {
			if (!(member.user.tag.toLowerCase().includes(text.toLowerCase())) &&
				!(member.nickname && member.nickname.toLowerCase().includes(text.toLowerCase())) &&
				!(member.user.id === text.replace(/[^\d]/g, '')) ||
				((member.lastMessage ? member.lastMessage.createTimestamp : 0) < mostRecentTimestamp)) continue;
			mostRecentTimestamp = member.lastMessage ? member.lastMessage.createTimestamp : 0;
			match = member;
		}

		return match;
	}

	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value); // eslint-disable-line no-useless-escape
	}

	async clean(string) {
		const {
			inspect
		} = require('util')
		string = await inspect(string, {
			depth: 0
		});
		string = await string.replace(this.bot.client.token, 'TOKEN_#*&($#*$(&#%&*#%^#*($#')

		const cleaned = string;

		return cleaned;
	}

	isHttp(value) {
		const regex = new RegExp("^(http|https)://");
		return regex.test(value)
	}

	async getUser(context, argsString) {
		let user;
		let result;

		if (!isNaN(argsString)) {
			try {
				const match = await this.bot.client.users.fetch(argsString);
				result = match;
			} catch (e) {
				// do nothing..
			}			
		}
	
		if (result) user = result;
		if (!result) {
			if (context.isDM) {
				if (!isNaN(argsString)) throw `:x: \`User with ID "${argsString}" not found.\``
				throw ':x: `Use UserID to get user in DMChannel`'
			}
			const match = this.getMemberFromString(context, argsString);
			if (!match) {
				if (!isNaN(argsString)) throw `:x: \`User with ID "${argsString}" not found.\``
				throw `:x: \`Member "${argsString}" not found.\``
			}
			user = match.user
		}

		return user
	}

	queryDB(query, args) {
		return new Promise((resolve, reject) => {
			this.bot.db.connect((err, cli, done) => {
				if (err) return reject(err);
				cli.query(query, args || [], (err, res) => {
					done();
					if (err) return reject(err);
					resolve(res);
				});
			});
		});
	}

	isImageArg(message, value) {
		if (!value) return false;
		if (message.attachments.size > 0) return false;
		if (value === '^' || this.isURL(value)) return true;
		if (/^<:.+:\d+>$/.test(value)) return true;

		return !!this.getMemberFromString(message, value);
	}
}

module.exports = utils;
