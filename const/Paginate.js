const EventEmitter = require('events');
const {
    MessageEmbed
} = require('discord.js');
const {
    stripIndent
} = require('common-tags')

/**
 * @param {class} Paginate - A pagination Util for MonoxBot framework.
 */

module.exports = class Paginate {
    constructor(bot) {
        this.bot = bot;

        this.timeout = 60000
    }

    initPaginate(msg, author, length, help) {
        let paginate = {};

        paginate.event = new EventEmitter();
        paginate.currentPage = 1;
        paginate.pages = length - 1;
        paginate.author = author;

        msg.paginate = paginate;

        this._drawPagination(msg, help); // eslint-disable-line no-underscore-dangle

        return msg.paginate.event;
    }

    initNext(msg, author) {
        let paginate = {};

        paginate.event = new EventEmitter();
        paginate.author = author;

        msg.paginate = paginate;

        this._drawNext(msg); // eslint-disable-line no-underscore-dangle

        return msg.paginate.event;
    }

    async _drawNext(msg) {
        try {
            await msg.react('🆕')

            return this._awaitResponseNext(msg); // eslint-disable-line no-underscore-dangle
        } catch (error) {
            // Do nothing..
        }
    }

    async _awaitResponseNext(msg) {
        const filter = (react, user) => {
            const passedEmojis = ['🆕'].includes(react.emoji.name);

            return user.id === msg.paginate.author.id && passedEmojis;
        }

        try {
            const reactions = await msg.awaitReactions(filter, {
                max: 1,
                time: 120000,
                errors: ['time']
            });

            const response = reactions.first();
            const user = response.users.last();

            if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) await response.users.remove(user);

            msg.paginate.event.emit('next');
            return this._awaitResponseNext(msg); // eslint-disable-line no-underscore-dangle

        } catch (error) {
            if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) {
                msg.reactions.removeAll();
            } else {
                this._stopPagination(msg); // eslint-disable-line no-underscore-dangle
            }

            if (error instanceof Error) throw error;
        }
    }

    async _drawPagination(msg, help) {
        try {
            await msg.react('◀');
            await msg.react('▶');
            await msg.react('⏹');
            if (help) await msg.react('ℹ');

            return this._awaitResponsePagination(msg); // eslint-disable-line no-underscore-dangle
        } catch (error) {
            // Do nothing..
        }
    }

    async _awaitResponsePagination(msg) {
        const filter = (react, user) => {
            const passedEmojis = ['◀', '▶', '⏹', 'ℹ'].includes(react.emoji.name);

            return user.id === msg.paginate.author.id && passedEmojis;
        }

        try {
            const reactions = await msg.awaitReactions(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            });

            const response = reactions.first();
            const user = response.users.last();
            const emoji = [response.emoji.name];

            if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) await response.users.remove(user);

            switch (emoji[0] || emoji[1]) {
                case '◀':
                    if (msg.paginate.pages === 0) return this._awaitResponsePagination(msg); // eslint-disable-line no-underscore-dangle

                    this._back(msg); // eslint-disable-line no-underscore-dangle
                    break;

                case '▶':
                    if (msg.paginate.pages === 0) return this._awaitResponsePagination(msg); // eslint-disable-line no-underscore-dangle

                    this._forward(msg); // eslint-disable-line no-underscore-dangle
                    break;

                case '⏹':
                    msg.delete();
                    break;

                case 'ℹ':
                    if (msg.paginate.pages === 0) return this._awaitResponsePagination(msg); // eslint-disable-line no-underscore-dangle

                    this._help(msg); // eslint-disable-line no-underscore-dangle
                    break;

                default:
                    break;
            }
        } catch (error) {
            if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) {
                msg.reactions.removeAll();
            } else {
                this._stopPagination(msg); // eslint-disable-line no-underscore-dangle
            }

            if (error instanceof Error) throw error;
        }
    }

    async _back(msg) {
        msg.paginate.currentPage = (msg.paginate.currentPage - 1 < 1) ? msg.paginate.pages : msg.paginate.currentPage - 1;

        msg.paginate.event.emit('paginate', msg.paginate.currentPage);

        return this._awaitResponsePagination(msg) // eslint-disable-line no-underscore-dangle
    }

    async _forward(msg) {
        msg.paginate.currentPage = (msg.paginate.currentPage + 1 <= msg.paginate.pages) ? msg.paginate.currentPage + 1 : 1

        msg.paginate.event.emit('paginate', msg.paginate.currentPage);

        return this._awaitResponsePagination(msg) // eslint-disable-line no-underscore-dangle
    }

    async _help(msg) {
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

        return this._awaitResponsePagination(msg) // eslint-disable-line no-underscore-dangle
    }

    _stopPagination(msg) {
        for (const reaction of msg.reactions.values()) {
            if (['◀', '▶', '⏹', 'ℹ'].includes(reaction.emoji.name)) {
                for (const user of reaction.users.values()) {
                    if (user.id === this.bot.client.user.id || (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES'))) {
                        reaction.users.remove(user);
                    }
                }
            }
        }

        delete msg.paginate;

        return true;
    }
}