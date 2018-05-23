const MonoxCommand = require('../../const/MonoxCommand.js');

class MagickCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'magick',
			aliases: ['magik', 'magic'],
			group: 'image-manipulation',
			memberName: 'magick',
			description: 'Apply an magick effect on a image.',
			examples: ['(User | @Mentions | URL)'],
			argsType: 'multiple',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			}
		})
	}
	
	async run(msg, args) {
		let image = await this.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return this.utils.invalidArgument(msg);
		let message = await msg.channel.send('Ok, Processing...')
    
		let output = `convert -liquid-rescale 50% -liquid-rescale 150%`
		let content = await this.axios.get(image[0]);
		let mimeType = content['headers']['content-type'];

		if (content['headers']['content-length'] > 2000000) {
			return message.edit(':x: ``Input image is too big (> 2MB)``');
		}

		if (mimeType === 'image/gif') {
			await message.delete();
			msg.channel.send(':x: ``Gif support for magick command currently disable for better P.R Bot``');
		} else {
			this.gm(this.request(image[0]))
				.out(...output.split(' '))
				.out('png8:')
				.toBuffer('PNG', function(err, buffer) {
					if (err) {
						message.delete();
						msg.channel.send(':x: Error while processing image. ```' + err + '```');
					} else {
						if (buffer.byteLength > 8388353) {
							message.delete();
							return msg.channel.send(':x: ``File is too big (> 8MB)``');	
						}
						message.delete();
						msg.channel.send({files: [{name: 'magick.png', attachment: buffer}]});
					}
				})				
		}
	}
}

module.exports = MagickCommand;