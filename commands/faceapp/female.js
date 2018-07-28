module.exports = {
    description: 'Make a face like female',
    category: 'Faceapp',
    args: '<@Mentions | User | URL>',
    cooldown: 2500,
    run: async function (ctx, { args }) {
        const images = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (images.length === 0) return `\`\`\`${ctx.prefix}female <@Mentions | User | URL>\n\nMake a face like female\`\`\``;

        try {
            const buffer = await ctx.bot.fAPI('faceapp', {
                images: images,
                args: {
                    text: 'female'
                }
            })

            return ctx.reply({
                files: [{
                    name: 'female.png',
                    attachment: buffer
                }]
            })
        } catch (error) {
            return `:x: \`${error.message}\``
        }
    }
}