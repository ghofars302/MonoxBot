class utils {
	constructor(MonoxBot) {
		this.MonoxBot = MonoxBot
	}
  
	async getBufferFromJimp(img, mime) {
		return new Promise((resolve, reject) => {
		img.getBuffer(mime || 'image/png', (err, buffer) => {
			if (err) reject(err)
			resolve(buffer)
		});
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
  
	async getImagesFromMessage(msg, args) {
		let imageURLs = [];
    
		for (const attachment of msg.attachments.values()) imageURLs.push(attachment.url);
		if (args[0] !== '^')
		for (const value of args) {
			if (this.isURL(value)) imageURLs.push(value);
			if (/<:.+:\d+>$/.test(value)) {
				imageURLs.push(`https://cdn.discordapp.com/embed/emojis/${value.match(/^<.+:(\d+)>$/)}.png`);
			} else {
			if (value === 'me') {
				imageURLs.push(msg.author.displayAvatarURL({format: 'png', size: 1024}));
				continue;
			}
          
			if (!msg.guild) {
				if (msg.author.tag.toLowerCase().includes(value.toLowerCase()) || msg.author.id === value.replace(/[^\d]/g, ''))
				imageURLs.push(msg.author.displayAvatarURL({format: 'png', size: 1024}));
				continue;
			}
          
			const match = this.getMemberFromString(msg, value);
			if (match) imageURLs.push(match.user.displayAvatarURL({format: 'png', size: 1024}));
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
  
	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}
}

module.exports = utils;
        