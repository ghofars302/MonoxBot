const MonoxCommand = require('../../const/MonoxCommand.js');

class InvertCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'invert',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'invert',
			description: 'Invert your image xD',
			examples: ['(User | @Mentions | URL)'],
			guildOnly: true,
			argsType: 'multiple',
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
		
		let message = await msg.channel.send('Ok, processing....')
		if (mimeType === 'image/gif') {
			this.gm(this.request(image[0]))
				.out('-negate')
				.toBuffer('GIF', function(err, buffer) {
					if (err) {
						message.delete();
						msg.channel.send(':x: Error while processing image. ```' + err + '```');
					} else {
						if (buffer.byteLength > 8388353) {
							message.delete();
							return msg.channel.send(':x: ``File is too big (> 8MB)``');	
						}
						message.delete();
						msg.channel.send({files: [{name: 'invert.gif', attachment: buffer}]});
					}					
				})
		} else {
			this.gm(this.request(image[0]))
				.out('-negate')
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
						msg.channel.send({files: [{name: 'invert.png', attachment: buffer}]});
					}
				})
		}
	}
}

module.exports = InvertCommand;