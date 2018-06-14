module.exports = {
	description: 'Evaluates code on the current shard.',
	category: 'adminOnly',
	args: '(code...)',
	adminOnly: true,
	run: async function (ctx, args, argsString) {
		try {
			if (!argsString) return this.messageHandler.invalidArguments(ctx.message);
		
			let result = await eval(argsString);
			result = await require('util').inspect(result, {depth: 0});
			result = await result.replace(this.client.token, 'nope');
		
			await ctx.send(result, {
				code: 'js'
			});
		} catch (err) {
			ctx.send(`${err || 'Unknown Error'}`, {code: 'js'})
		}
	}
}