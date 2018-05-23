const MonoxCommand = require('../../const/MonoxCommand.js');

class PingCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: [],
            group: 'util',
            memberName: 'ping',
            description: 'Show client lantency.',
            throttling: {
                usages: 1,
                duration: 1.5
            }
        })
    }

    async run(msg) {
        const message = await msg.channel.send('Sec, gotta ping discord WS.');
        message.edit(`Ok, It takes ☁ \`\`${Math.round(this.client.ping)}ms\`\` and 📝 \`\`${message.createdTimestamp - msg.createdTimestamp}ms\`\``);
	}
};

module.exports = PingCommand;