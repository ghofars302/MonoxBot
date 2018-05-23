const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class InviteCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: [],
            group: 'util',
            memberName: 'invite',
            description: 'Get Bot invite or Dev server invite.',
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
            .setFooter('MonoxBot ' + this.botVersion, this.client.user.displayAvatarURL());
        await msg.channel.send(embed);
    }
}

module.exports = InviteCommand;