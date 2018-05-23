const MonoxCommand = require('../../const/MonoxCommand.js');

class SayCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: [],
			group: 'util',
			memberName: 'say',
			description: 'Make bot saying your words.',
			examples: ['(Words...)'],
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);

		if (msg.author.id === this.config.owner) {
			await msg.channel.send(args)
		} else {
			let cleaned = await this.utils.filterMentions(args);
			await msg.channel.send(cleaned)
		}
	}
}

module.exports = SayCommand;