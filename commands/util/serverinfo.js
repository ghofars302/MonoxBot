const MonoxCommand = require('../../const/MonoxCommand.js');

class serverinfoCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ['server', 'guild'],
            group: 'util',
            memberName: 'serverinfo',
            description: 'Show Guild information.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }

    async run(msg) {
        const guild = new this.api.MessageEmbed();
        const message = await msg.channel.send('Getting info...');
        guild.setTitle('Server info ' + msg.guild.name)
            .setColor(0xFF0000)
            .setThumbnail(msg.guild.iconURL())
			.setFooter('MonoxBot ' + this.botVersion, this.client.user.displayAvatarURL())
            .addField('Owner:', msg.guild.owner.user.tag)
            .addField('Guild ID:', msg.guild.id)
            .addField('Create at:', msg.guild.createdAt)
            .addField('Member count:', msg.guild.memberCount)
            .addField('Guild Region:', msg.guild.region)
            .addField('Verification level:', msg.guild.verificationLevel)
        await message.delete();
        await msg.channel.send(guild);
    }
}

module.exports = serverinfoCommand;