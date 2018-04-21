const MonoxCommand = require('../../const/MonoxCommand.js');
const { exec } = require('child_process');

class PythonEval extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'peval',
			aliases: ['python', 'py'],
			group: 'util',
			memberName: 'peval',
			description: 'Execute python code...'
		})
	}
	
	async run(msg, argString) {
		if (msg.author.id !== this.config.owner) {
			msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
		} else if (!argString) {
			this.utils.infoTextBlock(msg, 'm!peval (code..)', 'Execute python code...')
		} else {
			async function output(err, stdout, stderr) {
				if (err) {
					msg.channel.send(stderr, {code: "py"});
				} else {
					if (stdout.length < 1) return msg.channel.send('✅ Executed!', {code: "py"});
					msg.channel.send(stdout, {code: "py"});
				};
			};
			exec('python -c "' + argString + '"', output);
		}
	}
}

module.exports = PythonEval;