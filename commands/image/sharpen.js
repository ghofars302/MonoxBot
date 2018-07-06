const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Make a image shinny or else :V',
    category: 'Image',
    cooldown: 2500,
    guildOnly: true,
    run: async (ctx, args) => {
        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (image.length === 0) return stripIndent`
            ${ctx.bot.config.prefix}sharpen <@Mentions | User | URL>

            Make a image shinny or else :V
        `

        const res = await ctx.bot.fetch(image[0]);
        const buf = await res.buffer();

        ctx.bot.gm(buf)
            .sharpen()
            .toBuffer('PNG', async (err, buffer) => {
                if (err) return ctx.bot.messageHandler.context.handleImageError(err, ctx);
                return await ctx.reply({files: [{attachment: buffer, name: 'sharpen.png'}]});
            })
    }
}