const MonoxCommand = require('../../const/MonoxCommand.js');

class SharpenCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'sharpen',
			aliases: ['sp'],
			group: 'image-manipulation',
			memberName: 'sharpen',
			description: 'Sharpen your image xD',
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, argString) {
		if (msg.channel.type === 'dm') return msg.reply('Sorry, this command can\'t be use in DM Channel.')
		let args = this.utils.splitArgs(argString);
		let image = await this.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return msg.channel.send('```m!sharpen (user || @mentions || url link)\n\nSharpen your image xD```');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.sharpen(15, 20)
			.toBuffer('PNG', function(err, buffer) {
				if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``').then(msg.channel.stopTyping(true));
				msg.channel.send({files: [{name: 'sharpen.png', attachment: buffer}]});
			});
		msg.channel.stopTyping(true);
	}
}

module.exports = SharpenCommand;