const MonoxCommand = require('../../const/MonoxCommand.js');

class TransparentCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'transparent',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'transparent',
			description: 'Make some color transparent!',
      argsType: 'multiple',
      argsCount: 2,
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, args) {
		if (msg.channel.type === 'dm') return msg.reply('Sorry, this command can\'t be use in DM Channel.')
		let image = await this.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return this.utils.infoTextBlock(msg, 'm!transparent (User || @Mentions || Url) (Color)', 'Make some color transparent!');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.transparent(args[1])
			.toBuffer('PNG', function(err, buffer) {
				if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``').then(msg.channel.stopTyping(true));
				msg.channel.send({files: [{name: 'transparent.png', attachment: buffer}]});
			});
		msg.channel.stopTyping(true);
	}
}

module.exports = TransparentCommand;