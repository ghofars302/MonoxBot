module.exports = {
	description: 'Sends command help',
	category: 'Utils',
	args: '(command)',
	cooldown: 1000,
	run: async function (ctx, args) {
		if (args.length === 1) {
			const commandName = args[0];
			if (!this.commands.has(commandName.toLowerCase())) return ctx.send('That command doesn\'t exist, try another one!');
			let command = this.commands.get(commandName.toLowerCase());
			if (command.alias) command = this.commands.get(command.name);

			const embed = new this.api.MessageEmbed()
				.setTitle(commandName)
				.setFooter('monoxbot.ga', this.client.user.displayAvatarURL())
				.addField('Description', command.description)
				.addField('Usage', `${commandName} ${command.args || ''}`)
				.setTimestamp();
			
			await ctx.send(embed);
		} else ctx.send(`<@!${ctx.author.id}>, http://monoxbot.ga`);
	}
};