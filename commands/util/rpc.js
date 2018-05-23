const MonoxCommand = require('../../const/MonoxCommand.js');

class RPC extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'rpc',
            aliases: [],
            group: 'util',
            memberName: 'rpc',
            description: 'Remote all shards',
            examples: ['(code..)'],
            ownerOnly: true
        })
    }

    async run(msg, argString) {
        if (!argString) return this.utils.invalidArgument(msg)
        try {
            let evaled = await this.client.shard.broadcastEval(argString);
            evaled = this.util.inspect(evaled);
            evaled = evaled.replace(this.client.token, 'TOKEN_LEAKED_XD')
                            .replace(process.env.API, 'API KEY LEAKED')
            msg.channel.send(evaled, {code: 'js'})
        } catch (error) {
            msg.channel.send(error, {code: 'js'});
        }
    }
}

module.exports = RPC;