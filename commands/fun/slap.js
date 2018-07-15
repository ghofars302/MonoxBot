module.exports = {
    description: 'Slap someone you hate or don\'t like',
    category: 'Fun',
    args: '[@Mentions | User]',
    cooldown: 2000,
    run: async function (ctx, { argsString }) {
        let userID = ctx.author.id;

        if (argsString) {
            if (ctx.isDM) return 'Yoo, you\'re in DMChannel so only me and you'
            const match = ctx.bot.utils.getMemberFromString(ctx, argsString);

            if (!match) return `:x: \`\`Member "${argsString}" not found.\`\``
            if (match.user.id !== userID || match.user.id !== ctx.main.user.id) {
                userID = match.user.id;
            }

        }

        const res = await ctx.bot.nekosapi.get('slap');

        const embed = new ctx.bot.api.MessageEmbed()
            .setDescription(userID === ctx.author.id || userID === ctx.main.user.id ? `Here let me slaps you <@!${ctx.author.id}>` : `<@!${ctx.author.id}> slapped <@!${userID}>, must be a real BAKA!!`)
            .setImage(res)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');

        return embed
    }
}