const MonoxCommand = require('../../const/MonoxCommand.js');

class SwirlCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'swirl',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'swirl',
			description: 'swirl your image xD',
			argsType: 'multiple',
			argsCount: 2,
			guildOnly: true,
			examples: ['(User | @Mentions | URL) (value)'],
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
      		let messageGif = await message.edit('Ok, processing.... (this gonna take a while)')
			this.gm(this.request(image[0]))
				.swirl(args[1] || 250)
				.autoOrient()
				.toBuffer('GIF', function(err, buffer) {
					if (err) {
						messageGif.delete();
						msg.channel.send(':x: Error while processing image. ```' + err + '```');
					} else {
						if (buffer.byteLength > 8388353) {
							messageGif.delete();
							return msg.channel.send(':x: ``File is too big (> 8MB)``');						
						}
						encodemsg.delete();
						msg.channel.send({files: [{name: 'swirl.gif', attachment: buffer}]})
					}				
				})
		} else {
			this.gm(this.request(image[0]))
				.swirl(args[1] || 250)
				.autoOrient()
				.toBuffer('PNG', function(err, buffer) {
					let BufferSize = buffer.byteLength;
					if (err) {
						message.delete();
						msg.channel.send(':x: Error while processing image. ```' + err + '```');
					} else {
						if (buffer.byteLength > 8388353) {
							message.delete();
							return msg.channel.send(':x: ``File is too big (> 8MB)``');						
						}
						message.delete();
						msg.channel.send({files: [{name: 'swirl.png', attachment: buffer}]})
					}	
				})
		}
	}
}

module.exports = SwirlCommand;