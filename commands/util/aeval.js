const stripIndents = require('common-tags').stripIndents;
const commando = require('discord.js-commando');
const util = require('util');

class AsyncEvalCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'aeval',
			aliases: [],
			group: 'util',
			memberName: 'aeval',
			description: 'eval javascript code with async',
			examples: ['Nothing here :D'],
		});
	}

  async run(msg, argString) {
    if (msg.author.id !== "344754852989108226") {
      msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
    } else if (!argString) {
      msg.channel.send(":warning: ``Unable to execute empty script``");
    } else {
			try {
				eval("(async () => { try {" + argString + "; msg.channel.send(':white_check_mark: ``Async eval execute success!``'); } catch (error) {msg.channel.send(':warning: ``Unable to execute async code`` ```' + error + '```');}})();")
			} catch (error) {
				msg.channel.send({embed: {
					description: `An error while eval. \`\`\`${error}\`\`\``
				}});
			}
    }
  }
};

module.exports = AsyncEvalCommand;
