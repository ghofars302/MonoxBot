const {get} = require('node-superfetch');
const {stripIndent, oneLine} = require('common-tags');
const {createCanvas,loadImage,registerFont} = require('canvas');
const {join} = require('path');

registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = {
    description: 'Create a Steam trading card from a image.',
    category: 'Image',
    cooldown: 5000,
    args: '<@Mentions | User | URL> <Text>',
    run: async (ctx, args) => {
        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);
        let text = ctx.bot.utils.isImageArg(ctx.message, args[0]) ? args.slice(1).join(' ') : args.join(' ');

        if (image.length === 0 && !text) return stripIndent`
            \`\`\`
            ${ctx.bot.config.prefix}steamcard <@Mentions | User | URL> <Text>

            Create a Steam trading card from a image.
            \`\`\`
        `
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'steamcard.png'));
            const {body} = await get(image[0]);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const context = canvas.getContext('2d');

            context.fillStyle = 'white';
            context.fillRect(0, 0, base.width, base.height);
            context.drawImage(avatar, 25, 25, 450, 450);
            context.drawImage(base, 0, 0);

            context.font = '30px Noto';
            context.fillText(text ? (text.length > 27 ? oneLine `${(text === text.toUpperCase()) ? text.slice(0, 15) : text.slice(0, 27)}` : oneLine `${text}`) : 'A discord user', 35, 48);

            return await ctx.reply({
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'steam-card.png'
                }]
            });
        } catch (error) {
            return ctx.bot.messageHandler.context.handleImageError(error, ctx);
        }
    }
}