const MonoxAPIError = require('../modules/MonoxAPIError');
const eventEmitter = require('events');
const {
    MessageEmbed
} = require('discord.js');
const {
    stripIndent
} = require('common-tags')

module.exports = class Paginate {
    constructor(bot) {
        this.bot = bot;

        this.emoji = {
            back: '◀',
            forward: '▶',
            delete: '⏹',
            info: 'ℹ'
        }

        this.timeout = 60000

        this.pages = null;
    }

    initPaginate(msg, author, length, help) {
        const event = new eventEmitter();

        if (author.bot) throw new MonoxAPIError('The author must be a normal user');
        if (!length || length < 1) throw new MonoxAPIError('The length must be > 0');

        msg.currentPage = 1;

        this.pages = length;
        this._drawPaginate(msg, author, event, help) // eslint-disable-line no-underscore-dangle

        return event;
    }


    async _awaitResponse(msg, author, event) {
        const emojis = Object.values(this.emoji);
        const filter = (react, user) => {
            const passedEmojis = emojis.includes(react.emoji.name);

            return user.id === author.id && passedEmojis;
        }

        try {
            const reactions = await msg.awaitReactions(filter, {
                max: 1,
                time: this.timeout,
                errors: ['time']
            });
            const response = reactions.first();
            const user = response.users.last();
            const emoji = [response.emoji.name];

            if (emoji.includes(this.emoji.delete)) return msg.delete();

            if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) await response.users.remove(user);

            switch (emoji[0] || emoji[1]) {
                case this.emoji.back:
                    if (this.page === 1) return this._awaitResponse(msg, author, event); // eslint-disable-line no-underscore-dangle

                    this._back(event, msg, author) // eslint-disable-line no-underscore-dangle
                    break;

                case this.emoji.forward:
                    if (this.page === 1) return this._awaitResponse(msg, author, event); // eslint-disable-line no-underscore-dangle

                    this._forward(event, msg, author) // eslint-disable-line no-underscore-dangle
                    break;

                case this.emoji.info:
                    if (this.page === 1) return this._awaitResponse(msg, author, event) // eslint-disable-line no-underscore-dangle

                    this._help(event, msg, author) // eslint-disable-line no-underscore-dangle
                    break;

                default:
                    break;
            }
        } catch (error) {
            this.stopPagination(msg);

            if (error instanceof Error) throw error;
        }
    }

    async _drawPaginate(msg, author, event, help) {
        try {
            await msg.react('◀');
            await msg.react('▶');
            await msg.react('⏹');
            if (help) await msg.react('ℹ');

            this._awaitResponse(msg, author, event); // eslint-disable-line no-underscore-dangle
        } catch (error) {
            // do nothing..
        }
    }

    async _back(event, msg, author) {
        msg.currentPage = (msg.currentPage - 1 < 1) ? this.pages : msg.currentPage - 1;

        event.emit('paginate', msg.currentPage);

        return this._awaitResponse(msg, author, event) // eslint-disable-line no-underscore-dangle
    }

    async _forward(event, msg, author) {
        msg.currentPage = (msg.currentPage + 1 <= this.pages) ? msg.currentPage + 1 : 1

        event.emit('paginate', msg.currentPage);

        return this._awaitResponse(msg, author, event) // eslint-disable-line no-underscore-dangle
    }

    async _help(event, msg, author) {
        const embed = new MessageEmbed()
            .setDescription(stripIndent `
                MonoxPagination util helper.

                ◀ => Back to previously page.
                ▶ => Forward to next page.
                ⏹ => Stop the pagination and delete the message.
                ℹ => Show this message helper.

                NOTE: this paginator still WIP. may contains
                     some bugs
            `)
            .setFooter(`monoxbot.ga`)
            .setTimestamp();

        msg.edit(embed)

        return this._awaitResponse(msg, author, event) // eslint-disable-line no-underscore-dangle
    }

    stopPagination(message) {
        for (const reaction of message.reactions.values()) {
            if (Object.values(this.emoji).includes(reaction.emoji.name)) {
                for (const user of reaction.users.values()) {
                    if (user.id === this.bot.client.user.id || (message.guild && message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))) {
                        reaction.users.remove(user);
                    }
                }
            }
        }
    }
}