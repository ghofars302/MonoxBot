module.exports = {
	description: 'Display someone avatar (default to you.)',
    category: 'utils',
    args: '(@Mentions | User)',
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

        const userObot = ctx.main.users.get(userID)

        ctx.send(`\`\`${userObot.tag}\`\`'s avatar: \n${userObot.displayAvatarURL({size: 1024})}`);
	}
}