class utils {
	constructor(bot) {
		this.bot = bot;
	}
	
	isAdmin(userID) {
		return this.bot.config.admins.includes(userID);
	}
	
	handleCommandError(err, msg, done) {
		if (done) done();
		if (err.name === 'FetchError') {
			console.log('[MonoxAPI] [ERROR] ' + err.message);
			return msg.channel.send(':warning: ``API down or took too long.``');
		}

		console.error(`[Shard ${this.bot.client.shard.id}] [CommandError] Error: \n${(err && err.stack) || err}`);
		msg.channel.send(`:warning: An error occoured \`\`\`js\n${err || 'Unknown Error'}\`\`\``);
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
							imageURLs.push(msg.author.displayAvatarURL({format: 'gif', size: 1024}));
							continue;
						} else {
							imageURLs.push(msg.author.displayAvatarURL({format: 'png', size: 1024}));
							continue;
						}
					}
			
					if (!msg.guild) {
						if (msg.author.tag.toLowerCase().includes(value.toLowerCase()) || msg.author.id === value.replace(/[^\d]/g, '')) {
							if (msg.author.displayAvatarURL().endsWith('.gif')) {
								imageURLs.push(msg.author.displayAvatarURL({format: 'gif', size: 1024}));
								continue;							
							} else {
								imageURLs.push(msg.author.displayAvatarURL({format: 'png', size: 1024}));
								continue;
							}
						}
					}
          
					const match = this.getMemberFromString(msg, value);
					if (match) {
						if (match.user.displayAvatarURL().endsWith('.gif')) {
							imageURLs.push(match.user.displayAvatarURL({format: 'gif', size: 1024}));						
						} else {
							imageURLs.push(match.user.displayAvatarURL({format: 'png', size: 1024}));
						}
					}
				}
			}
			if (imageURLs.length === 0) {
				const messages = await msg.channel.messages.fetch({limit: 20});
     
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
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}

	isImageArg(msg, value) {
		if (!value) return false;
		if (msg.attachments.size > 0) return false;
		if (value === '^' || this.isURL(value)) return true;
		if (/^<:.+:\d+>$/.test(value)) return true;

		return !!this.getMemberFromString(msg, value);
	}

	async clean(string) {
		const {inspect} = require('util')
		string = await inspect(string, {depth: 0});
		string = await string.replace(this.bot.client.token, 'TOKEN_#*&($#*$(&#%&*#%^#*($#')

		const cleaned = string;

		return cleaned;
	}

	isHttp(value) {
		const regex = new RegExp("^(http|https)://");
		return regex.test(value)
	}

	async fetchFromAPI(endpoint, url) {
		const fetch = require('node-fetch');

		let cleaned = encodeURIComponent(url);
		
		const APIUrl = `http://localhost:3000/api/`;

		let result = await fetch(`${APIUrl}${endpoint}?key=${process.env.KEY1}&url=${cleaned}`, {
			method: 'POST'
		});
		let json = await result.json();
		if (json['ERROR']) {
			throw json['ERROR'];
		}

		let buffer = Buffer.from(json['BUFFER']['data']);

		return buffer;
	}

	getUserFromString(text) {
		if (!text) return;
		let mostRecentTimestamp = 0;
		let match;
    
		for (const member of this.bot.client.users.array()) {
			if (!(member.tag.toLowerCase().includes(text.toLowerCase())) &&
				!(member.id === text.replace(/[^\d]/g, '')) ||
				((member.lastMessage ? member.lastMessage.createTimestamp : 0) < mostRecentTimestamp)) continue;
			mostRecentTimestamp = member.lastMessage ? member.lastMessage.createTimestamp : 0;
			match = member;
		}
    
		return match;
	}

	getUser(msg, text) {
		if (!text) return;
		let result;
		let member;
		if (msg.guild) {
			member = this.getMemberFromString(msg, text);
			if (member) result = member.user;
		}
		if (!member) {
			const user = this.getUserFromString(text);
			if (user) result = user;
		}

		return result;
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

	static distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
		const data = ctx.getImageData(x, y, width, height);
		const temp = ctx.getImageData(x, y, width, height);
		const stride = width * strideLevel;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
				const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
				const dest = (j * stride) + (i * strideLevel);
				const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
				data.data[dest] = temp.data[src];
				data.data[dest + 1] = temp.data[src + 1];
				data.data[dest + 2] = temp.data[src + 2];
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}
}

module.exports = utils;