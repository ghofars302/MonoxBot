module.exports = {
	description: 'Apply a magick effect on a image.',
	category: 'image-manipulation',
	args: '(@Mentions | User | URL)',
	run: async function (ctx, args) {
                const image = await this.utils.getImagesFromMessage(ctx, args);

                if (image.length === 0) return this.messageHandler.invalidArguments(ctx);

                const buffer = await this.utils.fetchFromAPI('magick', image[0]);

                await ctx.send({files: [{
                        name: 'magick.png',
                        attachment: buffer
                }]});
        }
}