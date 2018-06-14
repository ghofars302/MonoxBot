module.exports = {
	description: 'Replies with the user\'s stats',
	category: 'Utils',
	args: '(@Mentions | User)',
	aliases: ['userinfo', 'whois', 'user'],
	cooldown: 5000,
	run: async function (ctx, args, argsString) {
		let userID = ctx.author.id;

		if (argsString) {
			const match = ctx.main.users.get(argsString);
			if (match) userID = match.id
			if (!match) {
				if (!ctx.guild) return ctx.reply(':x: ``Use UserID if you want search user outside guild or inside DM channel``');
				const match = ctx.bot.utils.getMemberFromString(ctx, argsString);
				if (!match) return ctx.send(`:x: \`\`Member called ${argsString} not found.\`\``);
				userID = match.user.id;
			}
		}

		const serverShardResults = await this.client.shard.broadcastEval(`this.guilds.filter(g => g.members.has('${userID}')).map(g => g.name)`);
		let servers = [];
		for (const serverShardResult of serverShardResults) servers = servers.concat(serverShardResult);
		const shownServers = servers.slice(-3);

		let body = `\`${shownServers.join('`, `')}`;
		body += shownServers.length < servers.length ? `\` + ${servers.length - shownServers.length} more` : '`';

		const isBot = ctx.main.users.get(userID).bot;
		const userObot = ctx.main.users.get(userID)
		const presence = ctx.main.users.get(userID).presence;
		const status = presence.status;
		const playing = presence.activity;
		const version = require('../../package.json')['version'];

		const embed = new ctx.bot.api.MessageEmbed()
			.setThumbnail(ctx.main.users.get(userID).displayAvatarURL())
			.setFooter(`MonoxBot ${require('../../package.json')['version']}`, ctx.main.user.displayAvatarURL())
			.setTimestamp()
			.setTitle(isBot ? `Bot info for ${userObot.tag}` : `User info for ${userObot.tag}`)
			.addField(isBot ? `BotID` : `UserID`, userID, true)
			.addField(isBot ? 'BotTag' : 'UserTag', userObot.tag, true)
			.addField('is Bot?', isBot, true)
			.addField(isBot ? 'API Library' : 'User last Message', userID === ctx.main.user.id ? `Discord.js ${ctx.bot.api['version']}` : isBot ? 'Unknown API Library' : ctx.guild.members.has(userID) ? (ctx.guild.members.get(userID).lastMessageID || 'No message send.') : 'User not in current guild.', true)
			.addField('Status', status === 'offline' ? '⚫ Offline' : status === 'online' ? '<:greencircle_:449563258706460672> Online' : '🔴 Do not disturb', true);

		if (playing) embed.addField('Playing', playing.name, true);

		embed.addField('Discord Join Date', userObot.createdAt);

		if (ctx.guild && ctx.guild.members.has(userID)) embed.addField('Guild Join Date', ctx.guild.members.get(userID).joinedAt);

		embed.addField(userID === '1' ? `Seen on ALL servers` : `Seen on ${servers.length} servers`, userID === '1' ? 'Too many to show ¯\\\_(ツ)\_/¯' : body);

		await ctx.send(embed);
	}
};

