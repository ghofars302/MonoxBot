const MonoxCommand = require('../../const/MonoxCommand.js');

class RPC extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'rpc',
            aliases: [],
            group: 'util',
            memberName: 'rpc',
            description: 'Remote all shards'
        })
    }

    async run(msg, argString) {
        if (msg.author.id !== this.config.owner) return msg.channel.send(':x: ``Access denied. only bot owner can use this command.``');
        if (!argString) return this.utils.infoTextBlock(msg, 'm!rpc (eval code)', 'Remote all shards');
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