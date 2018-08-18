module.exports = {
    description: 'Make a face like male',
    category: 'Faceapp',
    args: '<@Mentions | User | URL>',
    cooldown: 2500,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (images.length === 0) return `\`\`\`${ctx.prefix}male <@Mentions | User | URL>\n\nMake a face like male\`\`\``;

        try {
            const buffer = await ctx.bot.fAPI('faceapp', {
                images: images,
                args: {
                    text: 'male'
                }
            })

            return ctx.reply({
                files: [{
                    name: 'male.png',
                    attachment: buffer
                }]
            })
        } catch (error) {
            if (error instanceof ctx.bot.fetch.FetchError) return ':warning: ``API down or took too long``'
            return `:x: \`${error.message}\``
        }
    }
}