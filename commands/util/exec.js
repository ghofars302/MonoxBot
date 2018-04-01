const stripIndents = require('common-tags').stripIndents;
const commando = require('discord.js-commando');
const { exec } = require('child_process');

class EvalCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: [],
			group: 'util',
			memberName: 'exec',
			description: 'eval system-command code',
			examples: ['Nothing here :D'],
		});
	}

  async run(msg, argString) {
		async function output(error, stdout, stderr) {
			if (error) {
				msg.channel.send(stderr, {code: "xl"});
			} else {
				msg.channel.send(stdout, {code: "xl"});
			}
		}
    if (msg.author.id !== "344754852989108226") {
      msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
    } else if (!argString) {
      msg.channel.send(":warning: ``Unable to execute empty script``");
    } else {
      try {
				exec(argString, output);
      } catch (error) {
        msg.channel.send(error, {code: "xl"});
      }
    }
  }
};

module.exports = EvalCommand;
