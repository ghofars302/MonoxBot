const { Command } = require('discord.js-commando');
const { exec } = require('child_process');
const config = require('../../config/BotCfg.json');

class PythonEval extends Command {
	constructor(client) {
		super(client, {
			name: 'peval',
			alias: ['python'],
			group: 'util',
			memberName: 'peval',
			description: 'eval Python script.'
		})
	}
	
	async run(msg, argString) {
		if (msg.author.id !== config.owner) {
			msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
		} else if (!argString) {
			msg.channel.send(":warning: ``Unable to execute empty script``");
		} else {
			async function output(err, stdout, stderr) {
				if (err) {
					msg.channel.send(stderr, {code: "py"});
				} else {
					msg.channel.send(stdout, {code: "py"});
				};
			};
			exec('python -c "' + argString + '"', output);
		}
	}
}

module.exports = PythonEval;