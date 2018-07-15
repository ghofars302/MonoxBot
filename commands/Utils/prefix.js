module.exports = {
    description: 'Change guild prefix',
    guildOnly: true,
    args: '<Prefix> [reset|clear]',
    cooldown: 10000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `Current prefix for **${ctx.guild.name}** was **${ctx.prefix}**`;

        if (!ctx.member.hasPermission('MANAGE_MESSAGES')) return ':x: `Only member has MANAGE_MESSAGES can do this`';

        if (argsString === 'reset' || argsString === 'clear') {
            ctx.guild.commandPrefix = this.client.prefix;
            return `:white_check_mark: Reset guild prefix to default one.`
        }

        if (argsString.length > 3) return 'You can\'t change prefix with that length.'

        ctx.guild.commandPrefix = argsString;
        return `:white_check_mark: Changed guild prefix to **${argsString}**`
    }
}