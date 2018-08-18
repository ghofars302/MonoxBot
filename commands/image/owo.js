module.exports = {
    description: 'Owoooo',
    args: '<@Mentions | User | URL>',
    cooldown: 5000,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);
        
        if (images.length === 0) return ctx.bot.messageHandler.invalidArguments(ctx, 'Missing Image')

        const res = await ctx.bot.fAPI('owo', {
            images
        });

        return ctx.reply({
            files: [{
                name: 'owo.png',
                attachment: res
            }]
        })
    }
}