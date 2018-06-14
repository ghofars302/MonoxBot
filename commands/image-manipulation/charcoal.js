module.exports = {
	description: 'Apply a charcoal effect on a image.',
	category: 'image-manipulation',
	args: '(@Mentions | User | URL)',
	run: async function (ctx, args) {
                const image = await this.utils.getImagesFromMessage(ctx.message, args);

                if (image.length === 0) return this.messageHandler.invalidArguments(ctx.message);

                const buffer = await this.utils.fetchFromAPI('charcoal', image[0]);

                await ctx.send({files: [{
                        name: 'charcoal.png',
                        attachment: buffer
                }]});
        }
}