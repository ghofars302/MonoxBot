module.exports = {
	description: 'Reloads all commands',
	category: 'adminOnly',
	cooldown: 1000,
	adminOnly: true,
	run: function (ctx) {
		const startTime = Date.now();

		ctx.bot.commands = ctx.bot.ResourceLoader.loadCommands();
		
		return `:white_check_mark: Reloaded ${ctx.bot.commands.filter(c => !c.alias).size} commands with ${ctx.bot.commands.filter(c => c.alias).size} aliases in \`${Date.now() - startTime}ms\``
	}
};