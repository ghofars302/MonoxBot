const MonoxCommand = requre('../../const/MonoxCommand.js');

class AsyncEvalCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'aeval',
			aliases: [],
			group: 'util',
			memberName: 'aeval',
			description: 'Execute async javascript code...'
		})
	}
	
	async run(msg, argString) {
		if (msg.author.id !== this.config.owner) return msg.channel.send(':x: ``Access denied. only bot owner can use this command.``');
		if (!argString) return this.utils.infoTextBlock(msg, 'm!aeval (code...)', 'Execute async javascript code...');
		if (argString === 'return this.client') return msg.channel.send('Ayee retard. i won\'t evaluate the entire client object.');
		try {
			let result = await eval(`(async()=>{${argString}})()`);
			
			result = this.util.inspect(result, {depth: 0});
			result = result.replace(this.client.token, 'TOKEN_LEAKED_XD');
			
			msg.channel.send(result, {code: 'js'});
		} catch (error) {
			msg.channel.send(error, {code: 'js'});
		}
	}
}

module.exports = AsyncEvalCommand;