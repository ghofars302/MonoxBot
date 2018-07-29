module.exports = {
	description: 'Remote shards',
	category: 'adminOnly',
	args: '<Javascript code> | [pull | reload | restart]',
	adminOnly: true,
	run: async function (ctx, { args }) {
		if (args.length < 1) return `\`\`\`${ctx.prefix}rpc <Javascript code> | [pull | reload | restart]\n\nSubcommands:\n-pull (Pull bot update from Bot's repo)\n-reload (Reload all commands)\n-restart (Restart bot)\`\`\``;

		switch (args[0].toLowerCase()) {
			case 'pull':
				try {
					const { exec } = require('child_process');

					exec('git pull origin master', err => {
						if (err) throw err;
					})

					ctx.reply(':white_check_mark: `Git pulled!`')
				} catch (error) {
					ctx.reply(':x: `There a error while pull the git`');
				}
				break;
			case 'reload':
				try {
					await ctx.main.shard.broadcastEval(`
						this.bot.commands = this.bot.ResourceLoader.loadCommands();

						true
					`);

					ctx.reply(':white_check_mark: `Command reloaded on all shards`')
				} catch (error) {
					ctx.reply(':x: `There a error while broadcasting to other shards`');
				}
				break;
			case 'restart':
				try {
					await ctx.reply('Restarting bot..');

					await ctx.main.shard.broadcastEval(`process.exit()`);
				} catch (error) {
					ctx.reply(':x: `There a error while broadcasting to other shards`');
				}
				break;
			default:
				try {
					const argsString = args.join(' ')
					const code = /(^```[a-z]*)|(```*$)/g.test(argsString) ? argsString.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : argsString;

					const result = await ctx.main.shard.broadcastEval(`${code}`);

					await ctx.reply(`\`\`\`${JSON.stringify(result, null, 4) || '[]'}\`\`\``);
				} catch (error) {
					ctx.reply(`:x: \`There a error while broadcasting to other shards\` \`\`\`${error}\`\`\``);
				}
				break;
		}
	}
}