class Context {
    /**
     * @param {MonoxBot} bot - A main class of MonoxBot.
     * @param {MonoxClient} main - A extends Discord Client.
     * @param {Message} msg - Message that trigger the command.
     */
    constructor(bot, main, msg) {
        this.bot = bot
        this.main = main;
        this.message = msg;
    }

    /**
     * A wrapper around message.channel.send
     * @param {StringResolvable} [content] Message content that will get send into text channel.
     * @param {MessageOptions} [options] Options for message content.
     * @return {Promise} Message
     */
    send(content, options) {
        if(!options && typeof content === 'object' && !(content instanceof Array)) {
			options = content;
			content = '';
		}
		return this.message.channel.send(content, options);
    }
 
    /**
     * A wrapper around message.react.
     * @param {StringResolvable} [emoji] textEmoji or twiEmoji or Discord Emoji ID to react.
     * @return {Promise} MessageReaction
     */    
    react(emoji) {
        return this.message.react(emoji);
    }

    /**
     * A wrapper around message.channel.send but it will mention the author.
     * @param {StringResolvable} [content] Message content that will get send into text channel.
     * @param {MessageOptions} [options] Options for message content.
     * @return {Promise} Message
     */
    reply(content, options) {
        if(!options && typeof content === 'object' && !(content instanceof Array)) {
			options = content;
			content = '';
        }

        if (!this.message.guild) {
            return this.message.channel.send(content, options);
        }

        return this.message.channel.send(`<@!${this.message.author.id}>, ${content}`, options);
    }

    delete(timeout) {
        return this.message.delete(timeout);
    }

    get channel() {
        return this.message.channel;
    }

    get guild() {
        return this.message.guild;
    }

    get author() {
        return this.message.author;
    }

    get tts() {
        return this.message.tts;
    }

    get member() {
        return this.message.member;
    }

    get id() {
        return this.message.id;
    }

    get attachments() {
        return this.message.attachments;
    }

    get mentions() {
        return this.message.mentions;
    }

    get pinnable() {
        return this.message.pinnable;
    }

    get deletable() {
        return this.message.deletable;
    }

	get editedTimestamp() {
		return this.message.editedTimestamp;
    }
    
	get editedAt() {
		return this.message.editedAt;
    }

    get content() {
        return this.message.content;
    }
    
	get reactions() {
		return this.message.reactions;
	}

    pin() {
        return this.message.pin();
    }

    unpin() {
        return this.message.unpin();
    }
}

module.exports = Context;


