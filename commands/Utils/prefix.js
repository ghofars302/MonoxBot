module.exports = {
    description: 'Change guild prefix',
    guildOnly: true,
    args: '<Prefix> [reset|clear]',
    cooldown: 10000,
    run: async function (ctx, { argsString }) {
        if (argsString) {
			if (!ctx.member.hasPermission('MANAGE_GUILD') && !ctx.bot.utils.isAdmin(ctx.author.id)) return ':x: Only guild administrators can change the prefix'

			await ctx.bot.utils.queryDB('DELETE FROM settings WHERE server = $1 AND setting = $2', [ctx.guild.id, 'prefix']);
			if (['reset', 'clear', ctx.main.prefix].includes(argsString.toLowerCase())) {
                await ctx.guild.initPrefix()
				return `Prefix reset to \`${ctx.main.prefix}\``
			} else {
                await ctx.bot.utils.queryDB('INSERT INTO settings VALUES ($1, $2, $3)', [ctx.guild.id, 'prefix', argsString]);
                await ctx.guild.initPrefix()
				return `Prefix set to \`${argsString}\``
			}
		} else {
			const prefixResult = await ctx.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', ctx.guild.id]);
			const prefix = prefixResult.rowCount > 0 ? prefixResult.rows[0].value : ctx.main.prefix;

			return `Current prefix: \`${prefix}\``
		}

    }
}