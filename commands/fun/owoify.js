module.exports = {
        description: 'Turn text into a ..owo text maybe?',
        category: 'fun',
	args: '(Text...)',
	run: async function (ctx, args, argsString) {
                if (!argsString) return this.messageHandler.invalidArguments(ctx.message);

                const Text = encodeURIComponent(argsString);

                const result = await this.fetch('https://nekos.life/api/v2/owoify?text=' + Text);
                const json = await result.json();

                await ctx.send(`\`\`${ctx.author.username}\`\`'s just said: \`\`\`${json.owo}\`\`\``);
	}
}