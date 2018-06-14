module.exports = {
	description: 'Execute system process / commands.',
	category: 'adminOnly',
	cooldown: 1000,
    args: '(code..)',
    aliases: ['ceval'],
	adminOnly: true,
	run: async function (ctx, args, argsString) {
		if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

        this.childProcess.exec(argsString, async (err, stdout, stderr) => {
            if (err) {
                await ctx.send(stderr, {
                    code: 'xl'
                });
                return; 
            }

            ctx.send(stdout, {
                code: 'xl'
            })
        })
	}
};