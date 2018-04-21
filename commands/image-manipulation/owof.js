const MonoxCommand = require('../../const/MonoxCommand.js');

class owofCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'owof',
			aliases: [],
			group: 'image-manipulation',
			memberName: 'owof',
			description: 'shit filter xD.',
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
		
		if (image.length === 0) return msg.channel.send('```m!owof (user || @mentions || url link)\n\nApply shitty filter ever in your image xD```');
		
		msg.channel.startTyping();
		this.gm(this.request(image[0]))
			.flip()
			.flop()
			.magnify(1)
			.implode(3.5)
			.paint(1)
			.enhance()
			.resize(2048, 2048)
			.toBuffer('PNG', function(err, buffer) {
				if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?`` ```' + err + '```').then(msg.channel.stopTyping(true));
				msg.channel.send({files: [{name: 'owof.png', attachment: buffer}]})
			});
		msg.channel.stopTyping(true)
	}
}

module.exports = owofCommand;