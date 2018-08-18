const EventEmitter = require('events');
const emojis = ['⏮', '◀', '▶', '⏭', '⏹'];
const newEmojis = ['🆕'];

/**
 * Rewritten in 18 August 2018
 * 
 * @param {class} Paginate - A pagination Util for MonoxBot framework.
 */

module.exports = class Paginate {
    constructor(bot) {
        this.bot = bot;

        this.timeout = 60000
        this.emojis = ['⏮', '◀', '▶', '⏭', '⏹'];
        this.new = ['🆕'];
    }

    async handleReactionAdd(msgReaction, user) {
        if (user.bot || !msgReaction.message.pagination || msgReaction.message.pagination.invokerUserID !== user.id) return;

        if (msgReaction.message.guild && msgReaction.message.channel.permissionsFor(msgReaction.message.guild.me).has('MANAGE_MESSAGE')) {
            await msgReaction.users.remove(user);
        }

        if (msgReaction.message.pagination.type === 'next') {
            return msgReaction.message.pagination.eventEmitter.emit('next');
        }

        return this.paginationEvent(msgReaction);
    }

    async handleReactionRemove(msgReaction, user) {
        if (user.bot || !msgReaction.message.pagination || msgReaction.message.pagination.invokerUserID !== user.id) return;

        if (msgReaction.message.guild && msgReaction.message.channel.permissionsFor(msgReaction.message.guild.me).has('MANAGE_MESSAGE')) {
            return;
        }

        if (msgReaction.message.pagination.type === 'next') {
            return msgReaction.message.pagination.eventEmitter.emit('next');
        }

        return this.paginationEvent(msgReaction);
    }

    paginationEvent(msgReaction) {
        switch (msgReaction.emoji.name) {
            case '⏮':
                this.paginationFirst(msgReaction.message.pagination);
                break;
            case '◀':
                this.paginatePrevious(msgReaction.message.pagination);
                break;
            case '▶':
                this.paginateNext(msgReaction.message.pagination);
                break;
            case '⏭':
                this.paginateLast(msgReaction.message.pagination);
                break;
            case '⏹':
                msgReaction.message.delete();
                break;
            default:
                break;
        }
    }

    paginationFirst(pagination) {
        if (pagination.currentPage === 1) {
            return;
        }
      
        pagination.currentPage = 1;
        pagination.eventEmitter.emit('paginate', 1);
    }

    paginateLast(pagination) {
        if (pagination.currentPage === pagination.pageCount) {
          return;
        }
    
        pagination.currentPage = pagination.pageCount;
        pagination.eventEmitter.emit('paginate', pagination.pageCount);
    }

    paginateNext(pagination) {
        pagination.currentPage = (pagination.currentPage + 1 <= pagination.pageCount) ? pagination.currentPage + 1 : 1;
        pagination.eventEmitter.emit('paginate', pagination.currentPage);
    }

    paginatePrevious(pagination) {
        pagination.currentPage = (pagination.currentPage - 1 < 1) ? pagination.pageCount : pagination.currentPage - 1;
        pagination.eventEmitter.emit('paginate', pagination.currentPage);
    }

    initPaginate(message, invoker, pageCount) {
        if (message.guild && !message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS')) {
            message.edit('Sorry, but I\'m missing the folowing permission ADD_REACTIONS', {embed: []});
            return false;
        }

        const pgObject = {};

        pgObject.invokerUserID = invoker.id;
        pgObject.pageCount = pageCount;
        pgObject.currentPage = 1;
        pgObject.eventEmitter = new EventEmitter();
        pgObject.timer = setTimeout(this.stopPagination.bind(null, message, this.bot.client), 120000);
        message.pagination = pgObject;

        this.addReactions(message);

        return pgObject.eventEmitter;
    }

    initNext(message, invoker) {
        if (message.guild && !message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS')) {
            message.edit('Sorry, but I\'m missing the folowing permission ADD_REACTIONS', {embed: []});
            return false;
        }

        const nextObject = {};

        nextObject.invokerUserID = invoker.id;
        nextObject.eventEmitter = new EventEmitter();
        nextObject.timer = setTimeout(this.stopNext.bind(null, message, this.bot.client), 120000);
        nextObject.type = 'next';
        message.pagination = nextObject;

        for (const i of newEmojis) {
            try {
                message.react(i);
            } catch (e) {} // eslint-disable-line no-empty
        }

        return nextObject.eventEmitter;
    }

    async addReactions(message) {
        for (const i of emojis) {
            try {
                await message.react(i);
            } catch (e) {} // eslint-disable-line no-empty
        }
    }

    stopNext(message, main) {
        for (const reaction of message.reactions.values()) {
            if (newEmojis.includes(reaction.emoji.name)) {
                for (const user of reaction.users.values()) {
                    if (user.id === main.user.id || (message.guild && message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))) {
                        reaction.users.remove(user);
                    }
                }
            }
        }

        delete message.pagination;
    }

    stopPagination(message, main) {
        for (const reaction of message.reactions.values()) {
            if (emojis.includes(reaction.emoji.name)) {
                for (const user of reaction.users.values()) {
                    if (user.id === main.user.id || (message.guild && message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))) {
                        reaction.users.remove(user);
                    }
                }
            }
        }

        delete message.pagination;
    }
}