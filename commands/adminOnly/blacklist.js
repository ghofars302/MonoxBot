module.exports = {
    description: 'Blacklist user from use MonoxBot',
    category: 'adminOnly',
    args: '<@Mentions | User | URL>',
    adminOnly: true,
    run: async function (ctx, { argsString }) {
        if (!argsString) return ':x: `Must input user/userID/mention`';
        let user;

        try {
            const match = await ctx.bot.utils.getUser(ctx, argsString);

            user = match
        } catch (e) {
            return e
        }

        let list = ctx.main.provider.getBlacklist();

        if (list.includes(user.id)) {
            list.remove(user.id);

            ctx.main.provider.db.set('blacklist', list);

            return `:white_check_mark: Unblacklist **${user.tag}**.`;
        } else {
            list.push(user.id);

            ctx.main.provider.db.set('blacklist', list);

            return `:white_check_mark: Blacklist **${user.tag}** from use MonoxBot.`;
        }
    }
}