const MonoxCommand = require('../../const/MonoxCommand.js');

class HelpCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['halp'],
            group: 'util',
            memberName: 'help',
            description: 'Show help website or info of each command',
            examples: ['(Command name.)'],
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg, args) {
        const command = this.client.registry.commands;
        if (args) {  
            let query = command.find('name', args);
            if (query === undefined) return msg.channel.send(':x: ``Unknown command or aliases.``');
            if (msg.guild) {
                let GuildPrefix = msg.guild.commandPrefix;
                if (query.examples === null) {
                    const embed = new this.api.MessageEmbed();           
                    embed.setTitle(query.name)
                         .addField('Description', query.description)
                         .addField('Usage', `${GuildPrefix}${query.name}`)
                         .addField('Aliases', `${query.aliases}` || 'none');
                    await msg.channel.send(embed);
                } else {
                    const embed = new this.api.MessageEmbed();           
                    embed.setTitle(query.name)
                         .addField('Description', query.description)
                         .addField('Usage', `${GuildPrefix}${query.name} ${query.examples}`)
                         .addField('Aliases', `${query.aliases}` || 'none');
                    await msg.channel.send(embed);
                }
            } else {
                let DefaultPrefix = this.client.commandPrefix;
                if (query.examples === null) {
                    const embed = new this.api.MessageEmbed();           
                    embed.setTitle(query.name)
                         .addField('Description', query.description)
                         .addField('Usage', `${DefaultPrefix}${query.name}`)
                         .addField('Aliases', `${query.aliases}` || 'none');
                    await msg.channel.send(embed);
                } else {
                    const embed = new this.api.MessageEmbed();           
                    embed.setTitle(query.name)
                         .addField('Description', query.description)
                         .addField('Usage', `${DefaultPrefix}${query.name} ${query.examples}`)
                         .addField('Aliases', `${query.aliases}` || 'none');
                    await msg.channel.send(embed);
                }
            }
        } else {
            const embed = new this.api.MessageEmbed();
            embed.setTitle('Hello do you need help?')
                .addField('Commands', '[Here](http://monoxbot.ga)', true)
                .addField('Invite', '[Here](https://discordapp.com/oauth2/authorize?client_id=425292802801401866&permissions=8&scope=bot)', true)
                .addField('DevServer', '[Here](https://discord.gg/g8MF2zk)', true)
                .setFooter('MonoxBot ' + this.botVersion + ' | if You found broken command feels free to report through command m!report', this.client.user.displayAvatarURL());
            await msg.channel.send(embed);
        }
    }
}

module.exports = HelpCommand;