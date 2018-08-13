module.exports = {
	description: 'Evaluates Async Javascript code on current shard',
	category: 'adminOnly',
	args: '<Javascript code> | [-noreply] <Javascript code>',
	adminOnly: true,
	run: async function (ctx, { args }) {
		if (args.length < 1) return `\`\`\`${ctx.prefix}eval <Javascript code> | [-noreply] <Javascript code>\n\nFlags:\n-noreply (No output return Except for Error)\n\nEvaluate Async Javascript code on current shard.\`\`\``;

		let string = args.join(' ');
		let noReply = false;

		if (args.shift().toLowerCase() === '-noreply') {
			string = args.join(' ');
			noReply = true
		}

		const now = Date.now();
		try {
			const code = /(^```[a-z]*)|(```*$)/g.test(string) ? string.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : string;
			const result = await eval(`(async()=>{${code}})()`);

			if (noReply) return;
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${typeof result}\`\` \`\`\`js\n${ctx.bot.api.Util.escapeMarkdown(await ctx.bot.utils.clean(result), true, true)}\`\`\``
		} catch (error) { 
			ctx.error = true;
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${error === undefined ? 'undefined' : error === null ? 'null' : error.name}\`\` \`\`\`js\n${typeof error === 'string' ? ctx.bot.api.Util.escapeMarkdown(error, true, true) : error}\`\`\``
		}
	}
}
