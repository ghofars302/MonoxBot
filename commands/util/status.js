const MonoxCommand = require('../../const/MonoxCommand.js');

class StatusCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'status',
			aliases: [],
			group: 'util',
			memberName: 'status',
			description: 'Change status?'
		})
	}
	
	async run(msg, argString) {
		if (msg.author.id !== this.config.owner) return msg.channel.send(':x: ``Access denied. only bot owner can use this command``');
		if (!argString) {
			this.client.shard.broadcastEval('this.user.setActivity("m!help | 1.0.0")');
			msg.channel.send('✅ ``Reset status on all shards.``');
		} else {
			try {
				this.client.shard.broadcastEval(`this.user.setActivity("${argString}")`)
				msg.channel.send('✅ ``Changed status to ' + argString + ' on all shards.``');
			} catch (error) {
				msg.channel.send(':warning: ``Unable to change the status``');
			}
		}	
	}
}

module.exports = StatusCommand;