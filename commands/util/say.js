const MonoxCommand = require('../../const/MonoxCommand.js');

class SayCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: [],
			group: 'util',
			memberName: 'say',
			description: 'Make bot saying your words.',
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, argString) {
		if (!argString) return this.utils.infoTextBlock(msg, 'm!say (words...)', 'Make bot saying your words.')
		if (msg.author.id === this.config.owner) {
			return msg.channel.send(argString)
		} else {
			let cleaned = await this.utils.filterMentions(argString);
			return msg.channel.send(cleaned)
		}
	}
}

module.exports = SayCommand;