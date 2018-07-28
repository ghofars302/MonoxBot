module.exports = {
    description: 'Make a face like hotter',
    category: 'Faceapp',
    args: '<@Mentions | User | URL>',
    cooldown: 2500,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (images.length === 0) return `\`\`\`${ctx.prefix}hot <@Mentions | User | URL>\n\nMake a face like hotter\`\`\``;

        try {
            const buffer = await ctx.bot.fAPI('faceapp', {
                images: images,
                args: {
                    text: 'hot'
                }
            })

            return ctx.reply({
                files: [{
                    name: 'hot.png',
                    attachment: buffer
                }]
            })
        } catch (error) {
            return `:x: \`${error.message}\``
        }
    }
}