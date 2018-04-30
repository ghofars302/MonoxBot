const MonoxCommand = require('../../const/MonoxCommand.js');

class UndoCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'undo',
            aliases: [],
            group: 'util',
            memberName: 'undo',
            description: 'Delete last command.',
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg) {
        msg.channel.send(':x: ``Unable to find last command in database.``');
    }
}

module.exports = UndoCommand;