const ContextHandler = require('./Context');

class RegisterEvent {
    constructor(bot) {
        this.bot = bot;
        this.client = bot.client;

        this.message();
        this.botevent();
        this.others();
    }

    message() {
        this.client.on('message', (msg) => {
            const context = new ContextHandler().initContext(msg, this.client, this.bot);

            this.bot.messageHandler.ContextCommand(context);
        });

        this.client.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg === newMsg) return;
            try {
                if (this.bot.commandEditingStore.has(oldMsg.id)) {
                    const lastMessage = this.bot.commandEditingStore.get(oldMsg.id);
                    if (lastMessage) {
                        lastMessage.delete();
                        this.bot.commandEditingStore.delete(oldMsg.id);
                    }
                }
            } catch (e) {
                // do nothing..
            }

            const context = new ContextHandler().initContext(newMsg, this.client, this.bot);

            this.bot.messageHandler.ContextCommand(context);
        });

        this.client.on('messageDelete', (msg) => {
            if (!this.bot.commandEditingStore.has(msg.id)) return;
            
            try {
                const lastMessage = this.bot.commandEditingStore.get(msg.id);
                if (lastMessage) {
                    lastMessage.delete();
                    this.bot.commandEditingStore.delete(msg.id);
                }
            } catch (e) {
                // do nothing..
            }
        });
    }

    botevent() {
        this.client.on('error', (err) => {
            const ErrCleaned = this.bot.util.inspect(err);
            console.log(`[SHARD ${this.client.shard.id}] [ERROR] Error websocked: ${ErrCleaned}`); // eslint-disable-line no-console
        });

        this.client.on('disconnect', () => {
            console.log(`[SHARD ${this.client.shard.id}] [DISCONNECT] Disconnect from discord API.`); // eslint-disable-line no-console
            process.exit();
        });

        this.client.on('ready', async () => {
            if (!this.client.user.bot) {
                console.log(`[MonoxBot Framework] [TOKEN] Token was user's token and MonoxBot not support selfbot mode, exiting...`); // eslint-disable-line no-console
                return process.exit();
            }

            const fetched = await this.client.fetchApplication();

            if (fetched.owner.id !== this.client.owner) {
                console.log(`[MonoxBot Framework] [Error] The provided token owner not matched with owner ID, exiting...`) // eslint-disable-line no-console
                return process.exit();
            }

            console.log(`[SHARD ${this.client.shard.id}] [READY] Ready for commands, servings ${this.client.guilds.size.toString()} guilds`); // eslint-disable-line no-console
            this.client.user.setActivity(`${this.bot.config.prefix}help ${require('../package.json')['version']}`, {
                type: 'PLAYING'
            });
        });
    }

    others() {
        this.client.on('guildMemberAdd', (member) => {
            if (member.guild.id !== '440172556306087947') return;

            const channel = member.guild.channels.get('440172557040353282');

            channel.send(`<@${member.user.id}>, welcome to **MonoxBot dev server**. I hope you stay.`);
        });

        this.client.on('guildMemberRemove', (member) => {
            if (member.guild.id !== '440172556306087947') return;

            const channel = member.guild.channels.get('440172557040353282');

            channel.send(`**${member.user.tag}**, left cya.`);
        });
    }
}

module.exports = RegisterEvent;