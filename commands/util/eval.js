const commando = require('discord.js-commando');
const util = require('util');
const config = require('../../config/BotCfg.json');

class EvalCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'eval',
			aliases: [],
			group: 'util',
			memberName: 'eval',
			description: 'eval javascript code',
			examples: ['Nothing here :D'],
		});
	}

  async run(msg, argString) {
    if (msg.author.id !== config.owner) {
      msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
    } else if (!argString) {
      msg.channel.send(":warning: ``Unable to execute empty script``");
    } else {
      try {
        let evaled = eval(argString);
				if (evaled && evaled.constructor.name == "Promise")
					evaled = await evaled;
				if (typeof evaled !== "sting")
        	evaled = util.inspect(evaled, {depth: 0});

        evaled = evaled.replace(/`/g, "`" + String.fromCharCode(8203))
                       .replace(/@/g, "@" + String.fromCharCode(8203))
                       .replace(this.client.token, 'No, i wont evaluated the client token for you!');

				evaled.length > 2048 ? evaled = evaled.substring(0, 2000) : evaled;
				msg.channel.send(':white_check_mark: ``Eval execute success!``', {embed: {
					description: `\`\`\`js\n${evaled}\n\`\`\``
				}}
			);
      } catch (error) {
        msg.channel.send({embed: {
					description: `An error while eval. \`\`\`js\n${error}\`\`\``
				}});
      }
    }
  }
};

module.exports = EvalCommand;
