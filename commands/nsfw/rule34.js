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
            argType: 'array',
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg, argArray) {
        if (!msg.channel.nsfw) return msg.channel.send(':x: ``NSFW Command. please switch where channel tagged as NSFW``');
        if (!argArray) return this.utils.infoTextBlock(msg, 'm!rule34 (Query..)', 'Search image on rule34');
        try {
            let result = await this.booru('rule34', [argArray], {limit: 1, random: true});
            let images = await result.commonfly;
            for (const image of images) {
                let embed = new MessageEmbed()
                embed.setTitle('Rule34 Search result.')
                    .setImage(image.common.file_url)
                    .setFooter('MonoxBot 1.0.0, || Image rating: ' + image.common.rating, this.client.user.displayAvatarURL());
                msg.channel.send(embed);
            }
        } catch (error) {
            if (error.name === 'BooruError') {
                msg.channel.send(':warning: ``No result found..``');
            } else {
                msg.channel.send(':x: ``Error while executing command..``');
                console.log(error);
            }
        }
    }
}

module.exports = Rule34NSFW;