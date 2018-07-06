const {get} = require('node-superfetch');
const {stripIndent} = require('common-tags');
const {createCanvas,loadImage} = require('canvas');
const {join} = require('path');

module.exports = {
    description: 'Put a image on bobross\'s canvas',
    category: 'Image',
    cooldown: 5000,
    args: '<@Mentions | User | URL>',
    aliases: ['paint'],
    run: async (ctx, args) => {
        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);

        if (image.length === 0) return stripIndent`
            \`\`\`
            ${ctx.bot.config.prefix}bobross <@Mentions | User | URL>

            Put a image on bobross\'s canvas
            \`\`\`
        `
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'bobross.png'));
            const {body} = await get(image[0]);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const context = canvas.getContext('2d');

            context.fillStyle = 'white';
			context.fillRect(0, 0, base.width, base.height);
			context.rotate(3 * (Math.PI / 180));
			context.drawImage(avatar, 69, 102, 256, 256);
			context.rotate(-3 * (Math.PI / 180));
			context.drawImage(base, 0, 0);

            return ctx.reply({
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'bobross.png'
                }]
            });
        } catch (error) {
            return ctx.bot.messageHandler.context.handleImageError(error, ctx);
        }
    }
}