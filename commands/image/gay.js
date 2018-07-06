const {get} = require('node-superfetch');
const {stripIndent} = require('common-tags');
const {createCanvas,loadImage} = require('canvas');
const {join} = require('path');

module.exports = {
    description: 'Make a image looks gay.',
    category: 'Image',
    cooldown: 5000,
    args: '<@Mentions | User | URL>',
    run: async (ctx, args) => {
        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (image.length === 0) return stripIndent`
            \`\`\`
            ${ctx.bot.config.prefix}gay <@Mentions | User | URL>

            Make a image looks gay.
            \`\`\`
        `
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'gay.png'));
            const {body} = await get(image[0]);
            const avatar = await loadImage(body);
            const canvas = createCanvas(avatar.width, avatar.height);
            const context = canvas.getContext('2d');

            context.drawImage(avatar, 0, 0);
            context.drawImage(base, 0, 0, avatar.width, avatar.height);

            return ctx.reply({
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'gay.png'
                }]
            });
        } catch (error) {
            return ctx.bot.messageHandler.context.handleImageError(error, ctx);
        }
    }
}