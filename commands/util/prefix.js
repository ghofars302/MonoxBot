const MonoxCommand = require('../../const/MonoxCommand');

class info extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'prefix',
            aliases: [],
            group: 'util',
            memberName: 'prefix',
            description: 'Change Bot prefix on current guild, \ntype ``reset``in argument to reset guild prefix.\ntype ``none``in argument to remove guild prefix and only leave Mention prefix.',
            examples: ['(Prefix)'],
            throttling: {
                usages: 1,
                duration: 30
            }
        })
    }
    
    async run(msg, args) {
        if (args) {
            if (msg.guild) {
                if (!msg.member.hasPermission('ADMINISTRATOR') && msg.author.id !== this.config.owner) {
                    return msg.channel.send(':x: ``Only admininstrator can change Bot Guild prefix``');
                }
            } else if (msg.author.id !== this.config.owner) {
                return msg.channel.send(':x: ``Access denied only Bot owner can change Global prefix``');
            }

            const lowercase = args.toLowerCase();
            const prefix = lowercase === 'none' ? '' : args;

            let response;
            if (lowercase === 'reset') {
                if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
                const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'no prefix';
                response = `:white_check_mark: \`\`Reset current prefix to default prefix.\`\``;
            } else {
                if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
                response = prefix ? `:white_check_mark: \`\`Changed prefix to ${args}\`\`` : ':white_check_mark: ``Remove prefix. Only mention prefix now.``';
            }

            await msg.channel.send(response);

        } else {
            if (msg.guild) {
                if (!msg.guild.commandPrefix) {
                    return msg.channel.send(`:warning: \`\`${msg.guild.name} don't have any custom prefix.\`\``);
                }
                return msg.channel.send(`**${msg.guild.name}** Custom Prefix is \`\`${msg.guild.commandPrefix}\`\``);
            }
            msg.channel.send(`**MonoxBot** Global Prefix is \`\`${this.client.commandPrefix}\`\``);
        }
    }
}

module.exports = info;