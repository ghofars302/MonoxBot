const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class serverinfoCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ['server'],
            group: 'util',
            memberName: 'serverinfo',
            description: 'Show guild stats.',
            examples: ['server'],
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }

    async run(msg) {
        if (!msg.guild) return msg.reply('Sorry, but this channel not a guild.');
        const guild = new MessageEmbed();
        guild.setTitle('Server info ' + msg.guild.name)
            .setColor(0xFF0000)
            .setThumbnail(msg.guild.iconURL())
            .setFooter('MonoxBot 1.0.0', this.client.user.displayAvatarURL())
            .addField('Owner:', msg.guild.owner.user.tag)
            .addField('Guild ID:', msg.guild.id)
            .addField('Create at:', msg.guild.createdAt)
            .addField('Member count:', msg.guild.memberCount)
            .addField('Guild Region:', msg.guild.region)
            .addField('Verification level:', msg.guild.verificationLevel)
        msg.channel.send('Getting data...').then(m => setTimeout(function() {
            m.delete()
        }, 500)).then(msg.channel.send(guild));
    }
}

module.exports = serverinfoCommand;