/* eslint-disable max-lines */

const Bluebird = require('bluebird');

class utils {
	constructor(bot) {
		this.bot = bot;

		this.emojiRegex = RegExp('[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]', 'u');
		this.customEmojiRegex = RegExp('^(<:\\w+:)?(?<id>\\d{10,})>?$');
		this.customEmojiEndpoint = 'https://cdn.discordapp.com/emojis/';
		this.emojiEndpoint = 'https://bot.mods.nyc/twemoji/';
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

	emojiToCodePoint(unicodeSurrogates) { 
		const r = [];
		let c = 0;
		let p = 0;
		let i = 0;
	
		while (i < unicodeSurrogates.length) {
			c = unicodeSurrogates.charCodeAt(i++);
			if (p) {
				r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16)); // eslint-disable-line no-bitwise
				p = 0;
			} else if (c >= 0xD800 && c <= 0xDBFF) {
				p = c;
			} else {
				r.push(c.toString(16));
			}
		}
		return r.join('-');
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
			require('child_process').exec(code, function (err, stdout, stderr) { 
				if (err) reject(stderr || err); 
				resolve(stdout)
			});
		});
	}

	async checkImageURL(url) {
		let httpResponse;

		try {
			httpResponse = await this.bot.axios({
				method: 'head',
				url,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
				},
				maxRedirects: 5
			})
		} catch (error) {
			return false
		}

		return httpResponse.status === 200;
	}

	async getEmojiURL(input) {
		const isEmoji = this.emojiRegex.test(input)
		const customEmojiResult = this.customEmojiRegex.exec(input)

		let url;

		if (!isEmoji && !customEmojiResult) return false;

		if (isEmoji) {
			url = `${this.emojiEndpoint}${this.emojiToCodePoint(input)}.png`
		} else {
			url = `${this.customEmojiEndpoint}${customEmojiResult[2]}`
		}

		if (!await this.checkImageURL(url)) return false;

		return url;
	}

	async getImagesFromMessage(msg, args) {
		let imageURLs = [];

		for (const attachment of msg.attachments.values()) imageURLs.push(attachment.url);
		if (args[0] !== '^')
			for (const value of args) {
				if (this.isURL(value)) imageURLs.push(value);

				const emojiURL = await this.getEmojiURL(value);

				if (emojiURL) {
					imageURLs.push(emojiURL);
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
