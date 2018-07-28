const {Structures} = require('discord.js');
const Provider = require('./GuildProvider');
const Promise = require('bluebird');

module.exports = Structures.extend('Guild', Guild => {
    class MonoxBotGuild extends Guild {
        constructor(...args) {
            super(...args);

            this.provider = new Provider(this.client, this)

            this.guildPrefix = null;
            this.initPrefix();
        }

        async initPrefix() {
            try {
                const result = await this.provider.getPrefix();

                this.guildPrefix = result ? result : this.client.prefix;
            } catch (error) {} // eslint-disable-line no-empty
        }
        
        get commandPrefix() {
            if (this.guildPrefix === null) return this.client.prefix;
            return this.guildPrefix;
        }

        set commandPrefix(value) {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.provider.prefix(value, 'set');
                    resolve();
                } catch (error) {
                    reject(error)
                }
            })
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
