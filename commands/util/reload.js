const { oneLine } = require('common-tags');
const Commando = require('discord.js-commando');

module.exports = class ReloadCommandCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['re'],
			group: 'util',
			memberName: 'reload',
			description: 'Reloads a command or command group.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Providing a command group will reload all of the commands in that group.
				Only the bot owner(s) may use this command.
			`,
			examples: ['reload some-command'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to reload?',
					type: 'group|command'
				}
			]
		});
	}

	async run(msg, args) {
		const { cmdOrGrp } = args;
		const isCmd = Boolean(cmdOrGrp.groupID);
		cmdOrGrp.reload();
 	    if(!msg.author.id === "344754852989108226") return msg.channel.send(":x: ``Access denied. only Bot Owner can use this command.``");

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						this.registry.${isCmd ? 'commands' : 'groups'}.get('${isCmd ? cmdOrGrp.name : cmdOrGrp.id}').reload();
					}
				`);
			} catch(err) {
				this.client.emit('warn', `Error when broadcasting command reload to other shards`);
				this.client.emit('error', err);
				if(isCmd) {
					await msg.channel.send(`Reloaded \`${cmdOrGrp.name}\` command, but failed to reload on other shards.`);
				} else {
					await msg.channel.send(
						`Reloaded all of the commands in the \`${cmdOrGrp.name}\` group, but failed to reload on other shards.`
					);
				}
				return null;
			}
		}

		if(isCmd) {
			await msg.channel.send(`Reloaded \`${cmdOrGrp.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
		} else {
			await msg.channel.send(
				`Reloaded all of the commands in the \`${cmdOrGrp.name}\` group${this.client.shard ? ' on all shards' : ''}.`
			);
		}
		return null;
	}
};
