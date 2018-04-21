const { Command } = require('discord.js-commando');
const request = require('request');

class MagickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magick',
			aliases: ['magik'],
			group: 'image-manipulation',
			memberName: 'magick',
			description: 'Magick your image xD',
			examples: ['magick @your mom#0003'],
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, argString) {
    if (msg.channel.type === 'dm') return msg.reply('Sorry, this command can\'t be use in DM Channel.');
		let args = this.client.utils.splitArgs(argString);
		let image = await this.client.utils.getImagesFromMessage(msg, args);
		
		if (image.length === 0) return msg.channel.send('```m!magick (user || @mentions || url link)\n\nMagick your image XD.```');
		
    msg.channel.startTyping();
		this.client.gm(request(image[0]))
      .out('')
      .toBuffer('PNG', function(err, buffer) {
      if (err) return msg.channel.send(':warning: ``Unable to send file. perhaps missing permission?`` ```' + err + '```').then(msg.channel.stopTyping(true));
      msg.channel.send({files: [{name: 'magick.png', atachment: buffer}]})
    })
    msg.channel.stopTyping(true);
	}
}

module.exports = MagickCommand;