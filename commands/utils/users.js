module.exports = {
	description: 'Replies with the user\'s stats',
	category: 'Utils',
	args: '<@Mentions | User>',
	aliases: ['userinfo', 'whois', 'user', 'u'],
	cooldown: 5000,
	run: async function (ctx, args, argsString) {
		let user = ctx.author

		if (argsString) {
            try {
                const match = await ctx.bot.utils.getUser(ctx, argsString);

                user = match
            } catch (e) {
                return e
            }
		}

		const serverShardResults = await this.client.shard.broadcastEval(`this.guilds.filter(g => g.members.has('${user.id}')).map(g => g.name)`);
		let servers = [];
		for (const serverShardResult of serverShardResults) servers = servers.concat(serverShardResult);
		const shownServers = servers.slice(-3);

		let body = `\`${shownServers.join('`, `')}`;
		body += shownServers.length < servers.length ? `\` + ${servers.length - shownServers.length} more` : '`';
		
		const status = user.presence.status;
		const activity = user.presence.activity;
		const guild = ctx.guild ? ctx.guild.member(user) : false;

		const embed = new ctx.bot.api.MessageEmbed() 
			.setTitle(user.tag)
			.setThumbnail(user.displayAvatarURL())
			.setFooter('monoxbot.ga')
			.setTimestamp()
			.addField(`${user.bot ? 'BotID' : 'UserID'}`, user.id, true)

		if (activity) embed.addField(`${activity.type === 'LISTENING' ? 'Listening to' : activity.type === 'STREAMING' ? 'Streaming Game' : 'Playing'}`, `${activity.type === 'LISTENING' ? `${activity.state} ${activity.details}`  : activity.type === 'STREAMING' ? `[${activity.name}](${activity.url})` : activity.name}`, true) // eslint-disable-line no-multi-spaces
			.addField(`${user.bot ? 'Bot Created Date' : 'User Join Date'}`, new Date(user.createdTimestamp), true)

		if (guild) embed.addField('Guild Join Date', new Date(guild.joinedTimestamp))
			.addField(`Status`, `${status === 'dnd' ? 'Do not distrub' : status === 'idle' ? 'Idle' : status === 'online' ? 'Online' : 'Offline'}`)
			.addField(`See on \`${servers.length}\` server`, body)
		
		return embed
	}
};

