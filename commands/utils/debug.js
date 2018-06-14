module.exports = {
	description: 'Evaluates python code on rextester.com',
	category: 'Utils',
	args: '(code..)',
	run: async function (ctx, args, argsString) {
        if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

        const code = encodeURIComponent(argsString);
        const res = await this.fetch(`http://rextester.com/rundotnet/api?LanguageChoice=24&Program=${code}`, {
            method: 'POST'
        });

        const result = await res.json();

        if (result['Errors']) return ctx.send(result['Errors'], {
            code: 'py'
        });

        await ctx.send(result['Result'] || 'Empty response.', {
            code: 'py'
        });
	}
};
