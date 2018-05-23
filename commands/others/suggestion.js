const MonoxCommand = require('../../const/MonoxCommand.js');

class Suggestion extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'suggestion',
			aliases: ['suggest', 'report'],
			group: 'others',
			memberName: 'suggestion',
			description: 'Send a suggestion or bug report to the dev server.',
			examples: ['(Your suggestion or report)'],
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);

		if (args.length < 5) return msg.channel.send(':x: ``You can\'t send suggestion or report under 5 words``');

		const hook = new this.api.WebhookClient(process.env.HOOKID, process.env.HOOK, {
			disableEveryone: true
		})
		let word = await this.utils.filterMentions(args);
		if (!msg.guild) {
			await hook.send(`**Username:** ${msg.author.tag} \`\`${msg.author.id}\`\`\n**Channel:** DMChannel\n**Shard:** ${this.client.shard.id}\n**Suggest or report:** \`\`\`\n${this.api.escapeMarkdown(word, true)}\n\`\`\``);
			return await msg.channel.send(':white_check_mark: ``Success send suggestion or report to Dev server``');
		}

		await hook.send(`**Username:** ${msg.author.tag} \`\`${msg.author.id}\`\`\n**Guild:** ${msg.guild.name} \`\`${msg.guild.id}\`\`\n**Channel:** ${msg.channel.name} \`\`${msg.channel.id}\`\`\n**Shard:** ${this.client.shard.id}\n**Suggest or report:** \`\`\`\n${this.api.escapeMarkdown(word, true)}\n\`\`\``);

		await msg.channel.send(':white_check_mark: ``Success send suggestion or report to Dev server``');
	}
}

module.exports = Suggestion;
