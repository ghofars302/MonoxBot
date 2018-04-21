const MonoxCommand = require('../../const/MonoxCommand.js');

class oofCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'oof',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'oof',
			description: 'fucking shit crazy filter xD.',
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
		
		if (image.length === 0) return msg.channel.send('```m!oof (user || @mentions || url link)\n\nApply fucking shitty crazy filer in your image xD```');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.flip()
			.implode(2)
			.flop()
			.implode(0.5)
			.clip()
			.flop()
			.enhance()
			.emboss(2)
			.flip()
			.emboss(2)
			.toBuffer('PNG', function(err, buffer) {
				if (err) if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``').then(msg.channel.stopTyping(true));
				msg.channel.send({files: [{name: 'oof.png', attachment: buffer}]})
			});
		msg.channel.stopTyping(true)
	}
}

module.exports = oofCommand;