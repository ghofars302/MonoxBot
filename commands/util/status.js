const MonoxCommand = require('../../const/MonoxCommand.js');

class StatusCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'status',
			aliases: [],
			group: 'util',
			memberName: 'status',
			description: 'Change bot status on all Shards',
			examples: ['(Words...)'],
			ownerOnly: true
		})
	}
	
	async run(msg, args) {
		if (!args) {
			this.client.shard.broadcastEval('this.user.setActivity("m!help | 1.0.0")');
			msg.channel.send('✅ ``Reset status on all shards.``');
		} else {
			try {
				this.client.shard.broadcastEval(`this.user.setActivity("${args}")`)
				msg.channel.send('✅ ``Changed status to ' + args+ ' on all shards.``');
			} catch (error) {
				msg.channel.send(':warning: ``Unable to change the status``');
			}
		}	
	}
}

module.exports = StatusCommand;