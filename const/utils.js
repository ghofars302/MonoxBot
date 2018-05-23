/*
* @MonoxBot base utility class.
*/

const { MessageEmbed } = require('discord.js'); 
const { URL } = require('url');
const fetch = require('node-fetch');

class utils {
	constructor(bot) {
		this.client = bot;
	}
  
	filterMentions(string) {
		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if ((UID || NID) && this.client.users.has(UID || NID)) return `@${this.client.users.get(UID || NID).username}`;
			if (CID && this.client.channels.has(CID)) return `#${this.client.channels.get(CID).name}`;

			if (RID)
				for (const server of this.client.guilds.values())
					if (server.roles.has(RID)) return `@${server.roles.get(RID).name}`;

			if (CID) return '#deleted-channel';
			if (RID) return '@deleted-role';
			return '@invalid-user';
		});
	}

	async invalidArgument(msg) {
		let defaultPrefix = this.client.commandPrefix
		let command = msg.command.memberName;
		let example = msg.command.examples;
		let embed = new MessageEmbed();

		if (!msg.guild) {
			embed.addField('Invalid arguments - Try', '```\n' + defaultPrefix + command + ' ' + example + '```');
			embed.setColor(15158332);
			const message = await msg.channel.send(embed);
			return message.delete({
				timeout: 30000
			});
		}
 
		let guildPrefix = msg.guild.commandPrefix;
		embed.addField('Invalid arguments - Try', '```\n' + guildPrefix + command + ' ' + example + '```');
		embed.setColor(15158332);
		const message = await msg.channel.send(embed);
		return message.delete({
			timeout: 30000
		});
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
  
	isImageArg(msg, value) {
		if (!value) return;
		if (msg.attachments.size > 0) return false;
		if (value === '^' || this.isURL(value)) return true;
		if (/^<:.+:\d+>$/.test(value)) return true;
    
		return !!this.getMemberFromString(msg, value);
	}
	
	infoTextBlock(msg, title, description) {
		return msg.channel.send(`\`\`\`${title}\n\n${description}\`\`\``)
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
	
    splitArgs(string) {
		const splitArgs = string.trim().split('');
		
		const args = [];
		let inMultiwordArg = false;
		let currentArg = '';
		
		for (const char of splitArgs) {
			if (char === '') {
				inMultiwordArg = !inMultiwordArg;
			} else if (char === ' ' && !inMultiwordArg && currentArg) {
				args.push(currentArg);
				currentArg == '';
			} else if (char !== ' ' || inMultiwordArg) currentArg += char;
		}
		if (currentArg) args.push(currentArg);
		
		return args;
	}

	async fetchRexAPI(args, endpoints) {
		const API = require('./endpoints.json');
		
		let encodeURL = encodeURIComponent(args);
		let baseURL = `http://rextester.com/rundotnet/api`;
		let rawURL = new URL(`${baseURL}?LanguageChoice=${API[endpoints]}&Program=${encodeURL}`);

		let result = await fetch(rawURL, {
			method: 'POST'
		});

		return result;
	}

	async FetchOsuAPI(args, endpoints, mode) {
		let osuEndpoints = {
			"standard": 0,
			"taiko": 1,
			"catch": 2,
			"ctb": 2,
			"mania": 3
		}
		let QueryName = ['get_user', 'get_scores', 'get_user_best', 'get_user_recent', 'get_match', 'get_beatmaps'];
		if (!QueryName.includes(mode)) throw new Error('from FetchOsuAPI: Unknown game mode called ' + mode);
		let LowerEndpointsArgs = endpoints.toLowerCase();
		let encodeURL = encodeURIComponent(args);
		let raw = await fetch(`https://osu.ppy.sh/api/${mode}?k=${process.env.OSU}&u=${encodeURL}&m=${osuEndpoints[LowerEndpointsArgs]}`);

		return raw;
	}
  
	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}
	
	isYoutubeURL(value) {
		let exp = new RegExp("^(https?://)?(www.)?(youtube.com|youtu.?be)/.+$");
		return exp.test(value);
	}
  
	isHttp(value) {
		const regex = new RegExp("^(http|https)://");
		return regex.test(value)
	}
}

module.exports = utils;
        