class RegisterEvent {
    constructor(bot) {
        this.bot = bot;
        this.client = bot.client;

        this.message();
        this.botevent();
        this.others();
        this.pagination()
        this.personal();
    }

    message() {
        this.client.on('message', async (msg) => {
            const context = await this.bot.context.initContext(msg);

            return this.bot.messageHandler.ContextCommand(context);
        });

        this.client.on('messageUpdate', async (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            
            try {
                if (this.bot.commandEditingStore.has(oldMsg.id)) {
                    const lastMessage = this.bot.commandEditingStore.get(oldMsg.id);
                    if (lastMessage) {
                        lastMessage.delete();
                        this.bot.commandEditingStore.delete(oldMsg.id);
                        if (oldMsg.timer) {
                            clearTimeout(oldMsg.timer);
                        }
                    }
                }
            } catch (e) {} // eslint-disable-line no-empty

            const context = await this.bot.context.initContext(newMsg);

            return this.bot.messageHandler.ContextCommand(context);
        });

        this.client.on('messageDelete', (msg) => {
            if (!this.bot.commandEditingStore.has(msg.id)) return;
            
            try {
                const lastMessage = this.bot.commandEditingStore.get(msg.id);
                if (lastMessage) {
                    lastMessage.delete();
                    this.bot.commandEditingStore.delete(msg.id);
                    if (msg.timer) {
                        clearTimeout(msg.timer);
                    }
                }
            } catch (e) {} // eslint-disable-line no-empty
        });
    }
    
    personal() {
        this.client.on('message', async msg => {
            if (!msg.guild || msg.author.bot) return;
            if (msg.guild.id === '386922866890899456') {
                if (msg.channel.id === '387232388603838464') {
                    if (msg.content === '!download') {
                        try {
                            await msg.author.send('Trigon download link: http://www.arponag.xyz/Trigon.html');
                            return;
                        } catch (error) {
                            await msg.reply('Oof, seems you not open DM to everyone, or you block the bot from sending you Message');
                            return;
                        }
                    }
                }
            }
        })
    }

    botevent() {
        this.client.on('error', (err) => {
            const ErrCleaned = this.bot.util.inspect(err);
            this.bot.logger.error(`[ERROR] Error websocked: ${ErrCleaned}`); 
        });

        this.client.on('disconnect', () => {
            this.bot.logger.error(`[DISCONNECT] Disconnect from discord API.`); 
            process.exit();
        });

        this.client.on('ready', async () => {
            if (!this.client.user.bot) {
                this.bot.logger.error(`[TOKEN] Token was user's token and MonoxBot not support selfbot mode, exiting...`);
                return process.exit();
            }

            const fetched = await this.client.fetchApplication();
            
            if (this.client.owner === "" || !this.client.owner) {
                this.client.owner = fetched.owner.id;
                this.bot.config.admins = fetched.owner.id;
            }

            if (fetched.owner.id !== this.client.owner) {
                this.bot.logger.error(`[Error] The provided token owner not matched with owner ID, exiting...`)
                return process.exit();
            }

            if (!this.client.shard) {
                this.bot.logger('Running without sharding cause some commands not working.')
            }

            this.client.secret = fetched.botPublic ? false : true; // eslint-disable-line no-unneeded-ternary

            this.bot.logger.log(this.client, `[READY] Ready for commands, servings ${this.client.guilds.size.toString()} guilds`);
            this.client.user.setActivity(`${this.bot.config.prefix}help ${require('../package.json')['version']}`, {
                type: 'PLAYING'
            });
        });

        this.client.on('ratelimit', (ratelimit) => {
            this.bot.logger.error(`[Shard ${this.client.shard.id}] [Ratelimit] ${ratelimit.info} at ${ratelimit.path}`)
        })
    }

    pagination() {
        this.client.on('messageReactionAdd', (react, user) => {
            this.bot.Paginate.handleReactionAdd(react, user);
        })

        this.client.on('messageReactionRemove', (react, user) => {
            this.bot.Paginate.handleReactionRemove(react, user);
        })
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
