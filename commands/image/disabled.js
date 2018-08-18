module.exports = {
    description: 'Who disabled?',
    args: '<@Mentions | User | URL>',
    cooldown: 5000,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);
        
        if (images.length === 0) return ctx.bot.messageHandler.invalidArguments(ctx, 'Missing Image')

        const res = await ctx.bot.fAPI('disabled', {
            images
        });

        return ctx.reply({
            files: [{
                name: 'disabled.png',
                attachment: res
            }]
        })
    }
}