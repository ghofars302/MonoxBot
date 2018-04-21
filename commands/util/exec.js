const MonoxCommand = require('../../const/MonoxCommand.js');
const { exec } = require('child_process');

class EvalCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['ceval'],
			group: 'util',
			memberName: 'exec',
			description: 'Execute system command..',
			examples: ['Nothing here :D'],
		})
	}

	async run(msg, argString) {
		async function output(error, stdout, stderr) {
			if (error) {
				msg.channel.send(stderr, {code: "xl"});
			} else {
				if(stdout.length < 1) return msg.channel.send('✅ Task executed!, but no output were return.', {code: "xl"});
				if(stdout.length > 2040) return msg.channel.send('✅ Task executed!, but the output length was over 2048 word.', {code: "xl"});
				msg.channel.send(stdout, {code: "xl"});
			}
		}
		
		if (msg.author.id !== this.config.owner) {
			msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
		} else if (!argString) {
			this.utils.infoTextBlock(msg, 'm!exec (command..)', 'Execute system command...')
		} else {
			exec(argString, output)
		}
	}
};

module.exports = EvalCommand;
