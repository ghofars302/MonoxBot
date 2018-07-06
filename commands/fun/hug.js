module.exports = {
    description: 'Hug someone \\o/',
    category: 'Fun',
    args: '[@Mentions | User]',
    cooldown: 2000,
    run: async function (ctx, args, argsString) {
        let userID = ctx.author.id;

        if (argsString) {
            if (ctx.isDM()) return 'Yoo, you\'re in DMChannel so only me and you'
            const match = ctx.bot.utils.getMemberFromString(ctx, argsString);

            if (!match) return `:x: \`\`Member "${argsString}" not found.\`\``
            if (match.user.id !== userID || match.user.id !== ctx.main.user.id) {
                userID = match.user.id;
            }

        }

        const res = await ctx.bot.nekosapi.get('hug');

        const embed = new ctx.bot.api.MessageEmbed()
            .setDescription(userID === ctx.author.id || userID === ctx.main.user.id ? `Here let me hugs you <@!${ctx.author.id}>` : `Awoo, <@!${ctx.author.id}> has hugged <@!${userID}>`)
            .setImage(res)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');

        return embed;
    }
}