const MonoxCommand = require('../../const/MonoxCommand.js');

class jpegCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'jpeg',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'jpeg',
			description: 'format image into jpeg format',
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
		
		if (image.length === 0) return msg.channel.send('```m!jpeg (user || @mentions || url link)\n\nturn image into jpeg format```');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.toBuffer('JPEG', function(err, buffer) {
				if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``').then(msg.channel.stopTyping(true));
				msg.channel.send(':white_check_mark: Format success, => JPEG format.',{files: [{name: 'moremorejpeg.jpg', attachment: buffer}]});
			});
		msg.channel.stopTyping(true);
	}
}

module.exports = jpegCommand;