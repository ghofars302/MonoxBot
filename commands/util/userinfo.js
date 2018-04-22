const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class userinfoCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			aliases: ['user'],
			group: 'util',
			memberName: 'userinfo',
			description: 'Show infomation about you or guild member.',
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, argString) {
		const dm = new MessageEmbed();
		dm.setTitle('User info ' + msg.author.tag)
			.setColor(0xFF0000)
			.setThumbnail(msg.author.displayAvatarURL())
			.setFooter('MonoxBot 1.0.0', this.client.user.displayAvatarURL())
			.addField('UserID:', msg.author.id)
			.addField('Bot:', msg.author.bot)
			.addField('Discord join date:', msg.author.createdAt)
			.addField('Status:', msg.author.presence.status)
			.addField('Game:', msg.author.presence.activity);
		if (!msg.guild) return msg.channel.send(dm);
			
		const self = new MessageEmbed();
		self.setTitle('User info ' + msg.author.tag)
			.setColor(0xFF0000)
			.setThumbnail(msg.author.displayAvatarURL())
			.setFooter('MonoxBot 1.0.0', this.client.user.displayAvatarURL())
			.addField('UserID:', msg.author.id)
			.addField('Bot:', msg.author.bot)
			.addField('Discord join date:', msg.author.createdAt)
			.addField('Guild join date:', msg.guild.members.get(msg.author.id).joinedAt)
			.addField('Status:', msg.author.presence.status)
			.addField('Game:', msg.author.presence.activity);
		if (!argString) return msg.channel.send(self);
			
		const member = await this.utils.getMemberFromString(msg, argString);
		if (!member) return msg.channel.send(':x: ``User ' + argString + ' not found.``');
		const info = new MessageEmbed();
		info.setTitle('User info ' + member.user.tag)
			.setColor(0xFF0000)
			.setThumbnail(member.user.displayAvatarURL())
			.setFooter('MonoxBot 1.0.0', this.client.user.displayAvatarURL())
			.addField('UserID:', member.user.id)
			.addField('Bot:', member.user.bot)
			.addField('Discord join date:', member.user.createdAt)
			.addField('Guild join date:', msg.guild.members.get(member.user.id).joinedAt)
			.addField('Status:', member.user.presence.status)
			.addField('Game:', member.user.presence.activity);
		msg.channel.send(info)
	}
}

module.exports = userinfoCommand;