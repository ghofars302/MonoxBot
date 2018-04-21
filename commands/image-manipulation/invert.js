const MonoxCommand = require('../../const/MonoxCommand.js');

class InvertCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'invert',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'invert',
			description: 'Invert your image xD',
			examples: ['Invert @your mom#0003'],
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
		
		if (image.length === 0) return msg.channel.send('```m!Invert (user || @mentions || url link)\n\nInvert your image xD```');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.negative()
			.toBuffer('PNG', function(err, buffer) {
				if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``').then(msg.channel.stopTyping(true));
				msg.channel.send({files: [{name: 'Invert.png', attachment: buffer}]});
			});
		msg.channel.stopTyping(true);
	}
}

module.exports = InvertCommand;