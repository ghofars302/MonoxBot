module.exports = {
	description: 'Reloads all commands',
	category: 'adminOnly',
	cooldown: 1000,
	adminOnly: true,
	run: async function (ctx) {
		const startTime = Date.now();

		this.commands = this.ResourceLoader.loadCommands();
		if (ctx.guild && ctx.channel.permissionsFor(ctx.guild.me).has('MANAGE_MESSAGE')) ctx.delete();
		
		await ctx.send(`:white_check_mark: Reloaded ${this.commands.filter(c => !c.alias).size} commands with ${this.commands.filter(c => c.alias).size} aliases in \`${Date.now() - startTime}ms\``);
	}
};