module.exports = {
	description: 'Evaluates Javascript code on current shard',
	category: 'adminOnly',
	args: {
		type: 'code',
		pattern: '<Javascript code>',
		require: true
	},
	adminOnly: true,
	run: async function (ctx, { code, lang }) {
		const now = Date.now();

		if (!lang) lang = 'js';

		try {
			const result = await eval(`(async()=>{${code}})()`);

			if (result instanceof ctx.bot.api.Message) {
				if (ctx.guild.member(ctx.guild.me).hasPermission('ADD_REACTIONS')) return ctx.react('✅');
				return;
			}
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${typeof result}\`\` \`\`\`${lang}\n${ctx.bot.api.Util.escapeMarkdown(await ctx.bot.utils.clean(result), true, true)}\`\`\``
		} catch (error) { 
			ctx.error = true;
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${error === undefined ? 'undefined' : error === null ? 'null' : error.name}\`\` \`\`\`${lang}\n${typeof error === 'string' ? ctx.bot.api.Util.escapeMarkdown(error, true, true) : error}\`\`\``
		}
	}
}
