module.exports = {
    description: 'Make sad face to looks smile',
    category: 'Faceapp',
    args: '<@Mentions | User | URL>',
    cooldown: 2500,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (images.length === 0) return `\`\`\`${ctx.prefix}smile <@Mentions | User | URL>\n\nMake sad face to looks smile\`\`\``;

        try {
            const buffer = await ctx.bot.fAPI('faceapp', {
                images: images,
                args: {
                    text: 'smile'
                }
            })

            return ctx.reply({
                files: [{
                    name: 'smile.png',
                    attachment: buffer
                }]
            })
        } catch (error) {
            return `:x: \`${error.message}\``
        }
    }
}