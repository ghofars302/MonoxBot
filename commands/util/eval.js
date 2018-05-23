const MonoxCommand = require('../../const/MonoxCommand.js');

class EvalCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: [],
            group: 'util',
            memberName: 'eval',
            description: 'Evaluate javascript code on current shard.',
            examples: ['(Code...)'],
            ownerOnly: true
        })
    }

    async run(msg, args) {
        if (!args) return this.utils.invalidArgument(msg);
        if (args === 'this') return msg.channel.send('Ayee retard. i won\'t evaluate the entire this object.');

        try {
            let result = await eval(args);

            result = this.util.inspect(result, {
                depth: 0
            });
            result = result.replace(this.client.token, 'TOKEN_LEAKED_XD')
                          .replace(process.env.API, 'API_KEY_LEAKED_XD')
                          .replace(process.env.OSU, 'API_KEY_LEAKED_XD');

            await msg.channel.send(result, {
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