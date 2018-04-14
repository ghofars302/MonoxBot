const { Command } = require('discord.js-commando');

class EnlargeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enlarge',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'enlarge',
			description: 'Make your image bigger.'
			examples: ['enlarge @your mom#0001'],
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}

	async run(msg, argString) {
		let args = this.client.utils.splitArgs(argString);
		let image = await this.client.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return msg.channel.send('```m!enlarge (user || @mentions || url link)\n\nMake your image bigger xD');
		
		this.client.jimp.read(image[0], function(err, img) {
			if (err) return msg.channel.send(':warning: ``Unable to read image```');
			img.resize(2048, 2048)
				.getBuffer('image/png', function(err, buffer) {
					if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``');
					msg.channel.send({files: [{name: 'enlarge.png', attachment: buffer}]});
				});
		});
	}
}