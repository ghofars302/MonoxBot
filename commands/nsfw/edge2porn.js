module.exports = {
    description: 'Totally not a porn',
    aliases: ['e2p'],
    args: '<@Mentions | User | URL>',
    nsfw: true,
    cooldown: 5000,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);
        
        if (images.length === 0) return ctx.bot.messageHandler.invalidArguments(ctx, 'Missing Image')

        const res = await ctx.bot.fAPI('edges2porn', {
            images
        });

        return ctx.reply({
            files: [{
                name: 'edges2porn.png',
                attachment: res
            }]
        })
    }
}