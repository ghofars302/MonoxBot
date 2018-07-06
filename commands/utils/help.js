const {stripIndent} = require('common-tags');
const {displayHelpPage} = require('../../const/stringUtils');

module.exports = {
    description: 'Get list command or individual command information',
    category: 'Utils',
    cooldown: 5000,
    args: '<Command>',
    run: async function (ctx, args, argsString) {
        if (ctx.author.id !== ctx.main.owner && !ctx.bot.config.pageHelp && !argsString) return `Help command currently WIP, use \`\`${ctx.bot.config.prefix}help <Command>\`\` instead.`;

        if (!argsString) {
            const helpMsg = await ctx.reply(displayHelpPage())
        
            const paginate = ctx.bot.Paginate.initPaginate(helpMsg, ctx.author, 5);

            if (!paginate) {
                return false;
            }

            paginate.on('paginate', number => {
                helpMsg.edit(displayHelpPage(number));
            });

            return true;
        } 

        let command = ctx.bot.commands.get(argsString.toLowerCase());

        if (command) {
            if (command.alias) command = ctx.bot.commands.get(command.name);

            return stripIndent`
                \`\`\`
                ${ctx.bot.config.prefix}${command.args ? `${argsString} ${command.args}` : `${argsString}`}

                ${command.description}
                \`\`\`
            `
        }

        return 'That command doesn\'t exist, try another one!'
    }
}