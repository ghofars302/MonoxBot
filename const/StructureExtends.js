const {Structures} = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
    class MonoxBotGuild extends Guild {
        constructor(...args) {
            super(...args);
            this.guildPrefix = 'null'
        }
    }

    return MonoxBotGuild;
})

module.exports = Structures.extend('Message', Message => {
    class ContextMessage extends Message {
        constructor(...args) {
            super(...args);
        }
    }

    return ContextMessage;
})

module.exports = Structures.extend('TextChannel', TextChannel => {
    class GuildTextChannel extends TextChannel {
        constructor(...args) {
            super(...args);
        }
    }

    return GuildTextChannel;
})
