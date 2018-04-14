const commando = require('discord.js-commando');
const util = require('util');
const config = require('../../config/BotCfg.json');

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
    if (msg.author.id !== config.owner) {
      msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");
    } else if (!argString) {
      msg.channel.send(":warning: ``Unable to execute empty script``");
    } else {
			try {
				let result = await eval(`(async()=>{${argString}})()`);
        result = util.inspect(result, {depth: 0})
        result = result.replace(this.client.token, 'i wont let you evaluated the token');
			  msg.channel.send(result, {code: "js"});
      } catch (error) {
				msg.channel.send({embed: {
					description: `An error while eval. \`\`\`${error}\`\`\``
				}});
			}
    }
  }
};

module.exports = AsyncEvalCommand;
