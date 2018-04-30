const MonoxCommand = require('../../const/MonoxCommand');
const { MessageEmbed } = require('discord.js');

class PatCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'pat',
			aliases: ['pet'],
			group: 'weeb',
			description: 'Pat someone ( ͡° ͜ʖ ͡°)',
			memberName: 'pat',
			throttling: {
				usages: 1,
				duration: 2
			}
		})
	}
	
	async run(msg, argString) {
		if (!argString) return this.utils.infoTextBlock(msg, 'm!pat (User || @Mention)', 'Pat someone ( ͡° ͜ʖ ͡°) ');
		
		let member = await this.utils.getMemberFromString(msg, argString);
		if (!member) return msg.channel.send(':x: ``Member ' + argString + ' not found.``');
		if (msg.author.id === member.user.id) return msg.channel.send('You think you can pat yourself?');
		
		this.fetch('https://nekos.life/api/v2/img/pat')
			.then(res => res.json())
			.then(json => {
				let embed = new MessageEmbed();
				embed.setTitle(msg.author.username  + ' Pat ' + member.user.username)
					.setImage(json.url)
					.setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
				msg.channel.send(embed);
			});
	}
}

module.exports = PatCommand