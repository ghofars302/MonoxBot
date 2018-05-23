const MonoxCommand = require('../../const/MonoxCommand.js');

class DIE extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'die',
            aliases: [],
            group: 'util',
            memberName: 'die',
            description: 'Restart bot process on current shard.',
            ownerOnly: true
        })
    }

    async run(msg) {
        await msg.channel.send('Good night..');
        process.exit();
    }
}

module.exports = DIE;