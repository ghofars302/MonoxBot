const MonoxCommand = require('../../const/MonoxCommand');

class ImageCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'image',
			aliases: ['im', 'img'],
			group: 'others',
			description: 'Search google images',
			memberName: 'image',
			examples: ['(Query....)'],
			throttling: {
				usages: 1,
				duration: 2
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);
		let message = await msg.channel.send('Searching...')
		
		this.image.search(args)
			.then(async res => {
				try {
					const embed = new this.api.MessageEmbed();
					embed.setTitle('Image search result: ' + args)
						.setImage(res[0].url)
						.setFooter('MonoxBot 1.0.0 GoogleImageSearch', this.client.user.displayAvatarURL());
					await message.delete();
					msg.channel.send(embed);
				} catch (err) {
					if (err === 'Daily Limit Exceeded') {
						message.delete();
						return msg.channel.send(':x: ``MonoxBot has been ratelimit.``');
					}
					await message.delete();
					msg.channel.send(':x: ``Invalid search try again``');
				};
			});
	}
}

module.exports = ImageCommand;