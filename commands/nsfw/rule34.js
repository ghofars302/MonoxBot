const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class Rule34NSFW extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'rule34',
            aliases: ['r34'],
            group: 'nsfw',
            memberName: 'rule34',
            description: 'Search image on rule34',
            examples: ['(Tags..) (tags..)'],
            argsType: 'multiple',
            nsfw: true,
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg, args) {
        if (!args) return this.utils.invalidArgument(msg);

        let array = [args[0], args[1]];
        try {
        await this.booru.search('rule34.xxx', array, {limit: 1, random: true})
            .then(this.booru.commonfy)
            .then(async images => {
                for (let image of images) {
                    let embed = new this.api.MessageEmbed()
                        .setTitle('Rule34.xxx Search result.')
                        .setImage(image.common.file_url);

                    await msg.channel.send(embed);
                }
            })
        } catch (error) {
            if (error.name === 'BooruError') {
                return msg.channel.send(':warning: ``Images not found in query..``');
            }
            msg.channel.send(':warning: Unable to send image, probably missing permission? ```' + error + '```');
        }
    }
}

module.exports = Rule34NSFW;