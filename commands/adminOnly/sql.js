module.exports = {
	description: 'Executes SQL queries serverside',
	category: 'adminOnly',
	args: '(query..)',
	cooldown: 1000,
	adminOnly: true,
	run: async function (ctx, args, argsString) {
		if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

		try {
			const res = await this.utils.queryDB(argsString);

			await ctx.send(JSON.stringify(res.rows, null, 4), {
				code: 'json'
			});
		} catch (error) {
			console.error(error);
			await ctx.send(':warning: ``There a error while calling Database or DB result was too long (> 2000)``');			
		}
	}
};