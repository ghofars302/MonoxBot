module.exports = {
    description: 'Make funny message',
    category: 'Fun',
    args: '<Message>',
    cooldown: 2000,
    run: async function (ctx, args, argsString) {
        let userID = ctx.author.id;

        if (!argsString) return ':x: `You must provide the message to make it funny.`'

        const res = await ctx.bot.nekosapi.get('owo', argsString);

        const embed = new ctx.bot.api.MessageEmbed()
            .setDescription(`<@${userID}> Just said\n\n\`${res}\``)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');

        return embed;
    }
}