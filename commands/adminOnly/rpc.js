module.exports = {
	description: 'Remote shards',
	category: 'adminOnly',
	args: '<Javascript code> | [pull | reload | restart]',
	adminOnly: true,
	run: async function (ctx, { args }) {
		if (args.length < 1) return `\`\`\`${ctx.prefix}rpc <Javascript code> | [pull | reload | restart]\n\nSubcommands:\n-pull (Pull bot update from Bot's repo)\n-reload (Reload all commands)\n-restart (Restart bot)\`\`\``;

		switch (args[0].toLowerCase()) {
			case 'pull': 
				let result;
				
				try { 
					const { exec } = require('child_process');

					await exec('git pull origin master', {}, (err, stdout, stderr) => {
						if (err) throw stderr;
						result = stdout;
					}) 
					
					
					return `:white_check_mark: \`Operation success\`\n\`\`\`js\n${await result.stdout}\`\`\``;
				} catch (error) {
					return `:x: \`There a error while pull the git\`\n\`\`\`js\n${await error}\`\`\``;
				}
			case 'reload':
				try {
					await ctx.main.shard.broadcastEval(`
						this.bot.commands = this.bot.ResourceLoader.loadCommands();

						true;
					`);
					
					return ':white_check_mark: `Command reloaded on all shards`';
				} catch (error) { 
					return ':x: `There a error while broadcasting to other shards`';
				}
			case 'restart':
				try {
					await ctx.reply('Restarting bot..');

					return ctx.main.shard.broadcastEval(`process.exit()`);
				} catch (error) {
					return ':x: `There a error while broadcasting to other shards`'
				}
			default:
				try {
					const argsString = args.join(' ')
					const code = /(^```[a-z]*)|(```*$)/g.test(argsString) ? argsString.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : argsString;

					const result = await ctx.main.shard.broadcastEval(`${code}`);

					return `\`\`\`${JSON.stringify(result, null, 4) || '[]'}\`\`\``
				} catch (error) {
					return `:x: \`There a error while broadcasting to other shards\` \`\`\`${error}\`\`\``
				}
		}
	}
}
