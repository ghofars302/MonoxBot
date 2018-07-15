module.exports = {
	description: 'Evaluates code on the current shard.',
	category: 'adminOnly',
	args: '(code...)',
	adminOnly: true,
	run: async function (ctx, { args, argsString }) {
		if (!argsString) return this.messageHandler.invalidArguments(ctx);
		let argsCode = argsString;
		let trueOrNot = args.shift().toLowerCase();
		let dankCode = args.join(' ')
		let noReplyorNot = false;

		if (trueOrNot === '-noreply') {
			argsCode = dankCode
			noReplyorNot = true
		}

		const now = Date.now();
		try {
			const code = /(^```[a-z]*)|(```*$)/g.test(argsCode) ? argsCode.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : argsCode;
			const result = await eval(code);

			if (noReplyorNot) return;
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${typeof result}\`\` \`\`\`js\n${ctx.bot.api.Util.escapeMarkdown(await ctx.bot.utils.clean(result), true, true)}\`\`\``
		} catch (error) {
			return `Took: \`\`${Math.floor(Date.now() - now)}ms\`\`, Output type: \`\`${error === undefined ? 'undefined' : error === null ? 'null' : error.name}\`\` \`\`\`js\n${typeof error === 'string' ? ctx.bot.api.Util.escapeMarkdown(error, true, true) : error}\`\`\``
		}
	}
}