const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Get list command or individual command information',
    category: 'Utils',
    cooldown: 5000,
    aliases: ['cmds', 'halp'],
    args: '<Command>',
    run: async function (ctx, { argsString }) {
        if (ctx.author.id !== ctx.main.owner && !ctx.bot.config.pageHelp && !argsString) return `Help command currently WIP, use \`\`${ctx.bot.config.prefix}help <Command>\`\` instead.`;

        if (!argsString) {
            const helpMsg = await ctx.reply(ctx.bot.stringUtils.displayHelpPages())
        
            const paginate = ctx.bot.Paginate.initPaginate(helpMsg, ctx.author, 6);

            if (!paginate) {
                return false;
            }

            paginate.on('paginate', number => {
                helpMsg.edit(ctx.bot.stringUtils.displayHelpPages(number));
            });

            return true;
        } 

        let command = ctx.bot.commands.get(argsString.toLowerCase());

        if (command) {
            if (command.alias) command = ctx.bot.commands.get(command.name);

            return stripIndent`
                \`\`\`
                ${command.args ? (command.aliases ? `[${command.name}|${command.aliases.join('|')}] ${command.args ? (typeof command.args === 'object' ? command.args.pattern : command.args) : ''}`: `${command.name} ${command.args ? (typeof command.args === 'object' ? command.args.pattern : command.args) : ''}`) : `${argsString}`}

                ${command.description ? command.description : 'No description given.'}
                \`\`\`
            `
        }

        return 'That command doesn\'t exist, try another one!'
    }
}