const {get} = require('node-superfetch');
const {stripIndent} = require('common-tags');
const {createCanvas,loadImage} = require('canvas');
const {distort} = require('../../modules/canvas');

module.exports = {
    description: 'Glitching... a image',
    category: 'Image',
    cooldown: 5000,
    args: '<@Mentions | User | URL>',
    run: async (ctx, args) => {
        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (image.length === 0) return stripIndent`
            \`\`\`
            ${ctx.bot.config.prefix}glitch <@Mentions | User | URL>

            Glitching... a image.
            \`\`\`
        `
        try {
            const {body} = await get(image[0]);
            const data = await loadImage(body);
            const canvas = createCanvas(data.width, data.height);
            const context = canvas.getContext('2d');
            context.drawImage(data, 0, 0);
            distort(context, 20, 0, 0, data.width, data.height, 5);
            const buffer = canvas.toBuffer();
            if (Buffer.byteLength(buffer) > 8e+6) return `:x: \`\`Image cancel because size more than 8MB\`\``;

            return ctx.reply({
                files: [{
                    name: 'glitch.png',
                    attachment: buffer
                }]
            });
        } catch (error) {
            return ctx.bot.messageHandler.context.handleImageError(error, ctx);
        }
    }
}