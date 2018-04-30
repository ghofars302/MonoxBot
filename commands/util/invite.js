const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class InviteCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: [],
            group: 'util',
            memberName: 'invite',
            description: 'get invite link',
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg) {
        const embed = new MessageEmbed();
        embed.setTitle('You wanna invite this bot?')
            .addField('Invite', '[Here](https://discordapp.com/oauth2/authorize?client_id=425292802801401866&permissions=8&scope=bot)', true)
            .addField('DevServer', '[Here](https://discord.gg/g8MF2zk)', true)
            .setFooter('MonoxBot 1.0.0', this.client.user.displayAvatarURL());
        msg.channel.send(embed);
    }
}

module.exports = InviteCommand;