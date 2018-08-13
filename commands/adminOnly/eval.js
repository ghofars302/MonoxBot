module.exports = {
	description: 'Evaluates Javascript code on current shard',
	category: 'adminOnly',
	args: '<Javascript code> | [-noreply] <Javascript code>',
	adminOnly: true,
	run: async function (ctx, { args }) {
		if (args.length < 1) return `\`\`\`${ctx.prefix}eval <Javascript code> | [-noreply] <Javascript code>\n\nFlags:\n-noreply (No output return Except for Error)\n\nEvaluate Javascript code on current shard.\`\`\``;

		const now = Date.now();

		switch (args[0].toLowerCase()) {
			case '-noreply':
				try {
					const string = args.slice(1).join(' ').trim() // eslint-disable-line newline-per-chained-call
					const code = /(^```[a-z]*)|(```*$)/g.test(string) ? string.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : string;

					await eval(code);
				} catch (error) { 
					ctx.error = true;
					return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${error === undefined ? 'undefined' : error === null ? 'null' : error.name}\`\` \`\`\`js\n${typeof error === 'string' ? ctx.bot.api.Util.escapeMarkdown(error, true, true) : error}\`\`\``
				}
				break;
			default:
				try {
					const string = args.join(' ').trim();
					const code = /(^```[a-z]*)|(```*$)/g.test(string) ? string.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : string;

					const result = await eval(code);

					return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${typeof result}\`\` \`\`\`js\n${ctx.bot.api.Util.escapeMarkdown(await ctx.bot.utils.clean(result), true, true)}\`\`\``
				} catch (error) { 
					ctx.error = true;
					return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${error === undefined ? 'undefined' : error === null ? 'null' : error.name}\`\` \`\`\`js\n${typeof error === 'string' ? ctx.bot.api.Util.escapeMarkdown(error, true, true) : error}\`\`\``
				}
		}
	}
}
