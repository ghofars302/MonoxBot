const MonoxCommand = require('../../const/MonoxCommand.js');

class EvalCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: [],
            group: 'util',
            memberName: 'util',
            description: 'Execute javascript code...'
        })
    }

    async run(msg, argString) {
        if (msg.author.id !== this.config.owner) return msg.channel.send('❌ ``Access denied. only bot owner can use this command.``');
        if (!argString) return this.utils.infoTextBlock(msg, 'm1eval (code..)', 'Execute javascript code...');
        if (argString === 'this') return msg.channel.send('Ayee retard. i won\'t evaluate the entire this object.');
        try {
            let result = await eval(argString);

            result = this.util.inspect(result, {
                depth: 0
            });
            result = result.replace(this.client.token, 'TOKEN_LEAKED_XD');

            msg.channel.send(result, {
                code: 'js'
            });
        } catch (error) {
            msg.channel.send(error, {
                code: 'js'
            });
        }
    }
}

module.exports = EvalCommand;