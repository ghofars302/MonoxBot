const MonoxCommand = require('../../const/MonoxCommand');
const { MessageEmbed } = require('discord.js');

class ImageCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'image',
			aliases: ['im'],
			group: 'others',
			description: 'Search google images',
			memberName: 'image',
			throttling: {
				usages: 1,
				duration: 2
			}
		})
	}
	
	async run(msg, argString) {
		if (!argString) return this.utils.infoTextBlock(msg, 'm!image (query...)', 'Search google images\n\nNOTE: MonoxBot only can request image up to 100 per-day.');
		let message = await msg.channel.send('Searching...')
		
		this.image.search(argString)
			.then(res => {
				try {
					const embed = new MessageEmbed();
					embed.setTitle('Image search result: ' + argString)
						.setImage(res[0].url)
						.setFooter('MonoxBot 1.0.0 GoogleImageSearch', this.client.user.displayAvatarURL());
					message.delete().then(msg.channel.send(embed))
				} catch (err) {
					if (err === 'Daily Limit Exceeded') return message.delete().then(msg.channel.send(':x: ``MonoxBot has been ratelimit.``'));
					message.delete().then(msg.channel.send(':x: ``Invalid search try again``'));
				};
			});
	}
}

module.exports = ImageCommand;