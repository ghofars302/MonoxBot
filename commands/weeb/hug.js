const MonoxCommand = require('../../const/MonoxCommand');

class HugCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'hug',
			aliases: [],
			group: 'weeb',
			description: 'Hug someone ( ͡° ͜ʖ ͡°)',
			examples: ['(@Mentions | User)'],
			memberName: 'hug',
			throttling: {
				usages: 1,
				duration: 2
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);
		
		let member = await this.utils.getMemberFromString(msg, args);
		if (!member) return msg.channel.send(':x: ``Member ' + args + ' not found.``');
		if (msg.author.id === member.user.id) return msg.channel.send('You think you can hug yourself?');
		
		this.fetch('https://nekos.life/api/v2/img/hug')
			.then(res => res.json())
				.then(async json => {
					let embed = new this.api.MessageEmbed();
					embed.setTitle(msg.author.username  + ' hug ' + member.user.username)
						.setImage(json.url)
						.setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
					await msg.channel.send(embed);
				});
	}
}

module.exports = HugCommand