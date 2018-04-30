const MonoxCommand = require('../../const/MonoxCommand.js');

class MagickCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'magick',
			aliases: ['magik'],
			group: 'image-manipulation',
			memberName: 'magick',
			description: 'Magick your image xD',
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
		
		if (image.length === 0) return msg.channel.send('```m!magick (user || @mentions || url link)\n\nMagick your image xD```');
		
		let ass = await msg.channel.send('Processing... (This might take little longer..)')
		this.gm(this.request(image[0]))
			.command('convert')
			.in('-liquid-rescale')
			.out('75x75%')
			.toBuffer('PNG', function(err, buffer) {
				if (err) return ass.delete().then(msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?``'))
				ass.delete().then(msg.channel.send({files: [{name: 'magick.png', attachment: buffer}]}))
			});
	}
}

module.exports = MagickCommand;