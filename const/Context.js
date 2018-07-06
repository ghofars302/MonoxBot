const {DiscordAPIError} = require('discord.js');
const {FetchError} = require('node-fetch');

class Context {
    constructor() {}

    initContext(message, main, bot) {
        const context = {};

        context.message = message;
        context.main = main;
        context.bot = bot;
        context.id = message.id;
        context.content = message.content;
        context.channels = main.channels;
        context.channel = message.channel;
        context.users = main.users;
        context.member = message.member;
        context.author = message.author;
        context.createdAt = message.createdAt;
        context.guilds = main.guilds;
        context.guild = message.guild;


        context.isDM = () => {
            if (context.message.channel.type === 'dm') return true;
            return false;
        }

        context.isNSFW = context.message.channel.nsfw

        context.reply = async (...args) => this.handleMessage(context, 'default', args);

        context.direct = async (...args) => this.handleMessage(context, 'direct', args);

        context.react = emoji => {
            return context.message.react(emoji);
        }

        context.delete = timeout => {
            return context.message.delete(timeout)
        }

        return context;
    }

    async handleMessage(context, type, args) {
        const regex = new RegExp(`${context.main.token}`);

        if (args.length !== 0 && typeof args[0] === 'string' && (args[0].includes(context.main.token) || regex.test(args[0]))) {
            console.log(`[SHARD ${context.main.shard.id}] [WARNING] A message tried to send BOT TOKEN`); // eslint-disable-line no-console
            args[0] = args[0].replace(regex, '<TOKEN_CENSORED>');
        }

        if (type === 'direct') {
            return context.author.send(...args).then(m => {
                if (context.author.bot) return m;
                context.bot.commandEditingStore.set(context.id, m);

                return m;
            });
        } else {
            return context.channel.send(...args).then(m => {
                if (context.author.bot) return m;
                context.bot.commandEditingStore.set(context.id, m);

                return m;
            });
        }
    }

    handleError(error, context) {
        if (error instanceof DiscordAPIError) {
            return context.reply(`:warning: \`Message send failed, probably >8MB file upload or >2000 words\` \`\`\`js\n${error}\`\`\``);
        }

        if (error instanceof FetchError) {
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