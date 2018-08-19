class Context {
    constructor(bot) {
        this.bot = bot;
    }

    initContext(message) {

        const context = {};

        context.message = message;
        context.main = this.bot.client;
        context.bot = this.bot;
        context.id = message.id;
        context.content = message.content;
        context.isDM = !message.guild
        context.channels = this.bot.client.channels;
        context.channel = message.channel;
        context.users = this.bot.client.users;
        context.author = message.author;
        context.createdAt = message.createdAt;
        context.guilds = this.bot.client.guild;
        context.error = false;

        if (!context.isDM) {
            context.member = message.member;
            context.guild = message.guild;
        }

        context.prefix = context.isDM ? this.bot.client.prefix : message.guild.guildPrefix
        context.isNSFW = context.message.channel.nsfw

        context.reply = async (...args) => this.handleMessage(context, 'default', args);

        context.direct = async (...args) => this.handleMessage(context, 'direct', args);

        context.react = async emoji => {
            if (context.message.reactions.has(emoji)) {
                const reaction = await context.message.reactions.get(emoji);
                await reaction.remove()
            }
            return context.message.react(emoji);
        }

        context.delete = timeout => {
            return context.message.delete(timeout)
        }

        return context;
    }

    async handleMessage(context, type, args) {
        if (context.message.deleted) return;

        if (args.length !== 0 && typeof args[0] === 'string' && (args[0].includes(context.main.token))) {
            this.bot.logger.log(this.bot.client, `[WARNING] A message tried to send BOT TOKEN`); // eslint-disable-line no-console
            args[0] = args[0].replace(context.main.token, '<TOKEN_CENSORED>');
        }

        if (type === 'direct') {
            return context.author.send(...args).then(messageObject => {
                if (context.author.bot) return messageObject;
                context.bot.commandEditingStore.set(context.id, messageObject);
                
                messageObject.timer = setTimeout(() => {
                    if (context.bot.commandEditingStore.has(context.id)) {
                        context.bot.commandEditingStore.delete(context.id);
                    }
                }, 300000);

                return messageObject;
            });
        } else {
            return context.channel.send(...args).then(messageObject => {
                if (context.author.bot) return messageObject;
                context.bot.commandEditingStore.set(context.id, messageObject);
                
                messageObject.timer = setTimeout(() => {
                    if (context.bot.commandEditingStore.has(context.id)) {
                        context.bot.commandEditingStore.delete(context.id);
                    }
                }, 300000);
                
                return messageObject;
            });
        }
    }

    handleError(error, context) {
        if (error instanceof context.bot.api.DiscordAPIError) {
            return context.reply(`:warning: \`Message send failed, probably >8MB file upload or >2000 words\` \`\`\`js\n${error}\`\`\``);
        }

        if (error instanceof context.bot.fetch.FetchError || error instanceof context.bot.fAPI.Error) {
            if (error instanceof context.bot.fAPI.Error) {
                return context.reply(`:warning: \`fAPI processing failed\` \`\`\`js\n${error}\`\`\``);
            }
            console.log((error && error.stack) || error); // eslint-disable-line no-console
            return context.reply(':warning: ``API down or took too long``');
        }

        console.log((error && error.stack) || error); // eslint-disable-line no-console
        return context.reply(`:warning: A command throw error\n\`\`\`js\n${error}\`\`\``);
    }

    handleImageError(error, context) {
        console.log(error); // eslint-disable-line no-console
        return context.reply(`:warning: Image-processing failed. \`\`\`js\n${error}\`\`\``);
    }
}

module.exports = Context;

