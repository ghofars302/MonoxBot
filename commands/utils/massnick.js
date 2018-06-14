module.exports = {
	description: 'Changes the nickname of all server members',
	category: 'Utils',
	args: '(nickname..) | clear',
	guildOnly: true,
	adminGuildOnly: true,
	cooldown: 120000,
	run: async function (ctx, args, argsString) {
		if (!argsString) return this.messageHandler.invalidArguments(ctx.message);
		if (argsString.length > 32) return ctx.send(':x: Nicknames can\'t be longer than 32 characters');

		let changedCount = 0;
		let failedCount = 0;

		if (['clear', 'remove'].includes(argsString.toLowerCase())) {

			const status = await ctx.send(`Clearing the nicknames of \`${ctx.guild.memberCount}\` members...`);

			for (const member of ctx.guild.members.array()) {
				try {
					await member.setNickname('');
					changedCount++;
				} catch (e) {
					failedCount++;
				}

				await new Promise(r => setTimeout(r, 500));
			}

			status.delete();
			ctx.send(`Cleared \`${changedCount}\` nicknames, failed to clear \`${failedCount}\` (Missing Permissions)`);

		} else {

			const status = await ctx.send(`Changing the nicknames of \`${ctx.guild.memberCount}\` members...`);

			for (const member of ctx.guild.members.array()) {
				try {
					await member.setNickname(argsString);
					changedCount++;
				} catch (e) {
					failedCount++;
				}

				await new Promise(r => setTimeout(r, 500));
			}

			status.delete();
			ctx.send(`Changed \`${changedCount}\` nicknames, failed to change \`${failedCount}\` (Missing Permissions)`);

		}
	}
};