module.exports = {
	description: 'Evaluates code on all shards',
	category: 'adminOnly',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function (ctx, args, argsString) {
		if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

		try {
			let result = await this.client.shard.broadcastEval(argsString);
			result = JSON.stringify(result, null, 4) || '[]';
	
			await ctx.send(result, {
				code: 'js'
			});
		} catch (err) {
			await ctx.send(err, {code: 'js'});
		}
	}
};