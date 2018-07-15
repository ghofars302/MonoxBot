const {Structures} = require('discord.js');
const Provider = require('./GuildProvider');

module.exports = Structures.extend('Guild', Guild => {
    class MonoxBotGuild extends Guild {
        constructor(...args) {
            super(...args);

            this.provider = new Provider(this.client, this)

            this.guildPrefix = this.provider.getPrefix() ? this.provider.getPrefix() : this.client.prefix
        }
        
        get commandPrefix() {
            if (this.guildPrefix === null) return this.client.prefix;
            return this.guildPrefix;
        }

        set commandPrefix(value) {
            this.guildPrefix = value
            this.provider.setPrefix(value);
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
