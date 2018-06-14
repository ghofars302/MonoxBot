module.exports = {
	description: 'Evaluates code asynchonously on the current shard',
	category: 'adminOnly',
	cooldown: 1000,
	args: '(code..)',
	aliases: ['aeval'],
	adminOnly: true,
	run: async function (ctx, args, argsString) {
		try {
			if (!argsString) return this.messageHandler.invalidArguments(ctx.message);
		
			let result = await eval(`(async()=>{${argsString}})()`);
			result = await require('util').inspect(result, {depth: 0});
			result = await result.replace(this.client.token, 'nope');
		
			await ctx.send(result, {
				code: 'js'
			});
		} catch (err) {
			ctx.send(`${err || 'Unknown Error'}`, {code: 'js'})
		}
	}
};
