module.exports = {
    description: 'Run a command as another user/member',
    adminOnly: true,
    guildOnly: true,
    run: async function (ctx, { args }) {
        if (args.length < 2) return `\`\`\`${ctx.prefix}runas <user> <command>\n\nRun a command as another user/member\`\`\``;

        const user = ctx.users.get(args.shift().replace(/[^\d]/g, ''));
        if (!user) return ':x: ``Invalid user``';
        if (!ctx.guild.member(user)) return ':x: ``User not in guild``';

        await ctx.bot.messageHandler.ContextCommand(Object.assign(ctx, {
            author: user,
            member: ctx.guild.member(user),
            content: `<@!${ctx.main.user.id}> ${args.join(' ')}`
        }));

        return `Message processed as \`\`${user.tag}\`\``;
    }
}