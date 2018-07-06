module.exports = {
    description: 'Display someone avatar (default to you.)',
    category: 'Utils',
    args: '(@Mentions | User)',
    aliases: ['pfp'],
    run: async function (ctx, args, argsString) {
        let user = ctx.author;

        if (argsString) {
            try {
                const match = await ctx.bot.utils.getUser(ctx, argsString);

                user = match;
            } catch (e) {
                return e
            }
        }

        return `\`\`${user.tag}\`\`'s avatar: \n${user.avatarURL({size: 2048})}`
    }
}