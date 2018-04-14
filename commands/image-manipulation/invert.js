const { Command } = require('discord.js-commando');

class InvertCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invert',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'invert',
			description: 'Invert your image xD',
			examples: ['invert @your mom#0002'],
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, argString) {
		let args = this.client.utils.splitArgs(argString);
		let image = await this.client.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return msg.channel.send('```m!invert (user || @mentions || url link)\n\nInvert your image xD');
		
		this.client.jimp.read(image[0], function(err, img) {
			if (err) return msg.channel.send(':warning: ``Unable to read image```');
			img.invert()
				.getBuffer('image/png', function(err, buffer) {
					if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``');
					msg.channel.send({files: [{name: 'invert.png', attachment: buffer}]});
				});
		});
	}
}

module.exports = InvertCommand;