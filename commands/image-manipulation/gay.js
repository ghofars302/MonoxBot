const MonoxCommand = require('../../const/MonoxCommand.js');

class Rule34NSFW extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'gay',
            aliases: [],
            group: 'image-manipulation',
            memberName: 'gay',
            description: 'Give a gay effect',
            examples: ['(User | @Mentions | URL)'],
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg) {
        msg.reply('no u');
    }
}

module.exports = Rule34NSFW;