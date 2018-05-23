const MonoxCommand = require('../../const/MonoxCommand.js');

class FlipCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'flip',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'flip',
			description: 'flip your image xD',
			examples: ['(User | @Mentions | URL)'],
			argsType: 'multiple',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, args) {
		let image = await this.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return this.utils.invalidArgument(msg);
		
		let content = await this.axios.get(image[0]);
		let mimeType = content['headers']['content-type'];

		if (content['headers']['content-length'] > 2000000) {
			return message.edit(':x: ``Input image is too big (> 2MB)``');
		}
		
		let message = await msg.channel.send('Ok, processing....')
		if (mimeType === 'image/gif') {
      		let encodemsg = await message.edit('Ok, processing.... (this gonna take a while)')
			this.gm(this.request(image[0]))
				.flip()
				.toBuffer('GIF', function(err, buffer) {
					if (err) {
						messageGif.delete();
						msg.channel.send(':x: Error while processing image. ```' + err + '```');
					} else {
						if (buffer.byteLength > 8388353) {
							messageGif.delete();
							return msg.channel.send(':x: ``File is too big (> 8MB)``');						
						}
						messageGif.delete();
						msg.channel.send({files: [{name: 'flip.gif', attachment: buffer}]})
					}				
				})
		} else {
			this.gm(this.request(image[0]))
				.flip()
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
						msg.channel.send({files: [{name: 'flip.png', attachment: buffer}]})
					}	
				})
		}
	}
}

module.exports = FlipCommand;
