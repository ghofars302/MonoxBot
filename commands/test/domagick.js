module.exports = {
    description: 'Testing of imagemagick before export it to API',
    adminOnly: true,
    category: 'test',
    run: async function (ctx, args) {
        if (args.length < 1) return 'I need image and args';

        const image = await ctx.bot.utils.getImagesFromMessage(ctx.message, args);
        if (image.length === 0) return 'I can\'t find the image about 100 messages above';

        const msg = await ctx.reply('Ok, let me do the shit..');

        const {
            headers
        } = await ctx.bot.axios.get(image[0]);

        const output = args.join(' ').trim();

        const rawBuffer = await ctx.bot.fetch(image[0]);
        const buffer = await rawBuffer.buffer();

        if (headers['content-type'] === 'image/gif') {
            ctx.bot.gm(buffer)
                .out(...output.split(' '))
                .toBuffer('GIF', (error, buffer) => {
                    if (error) {
                        msg.delete();
                        return error
                    }
                    msg.delete();
                    ctx.reply({
                        files: [{
                            attachment: buffer,
                            name: 'domagick.gif'
                        }]
                    });
                });
        } else {
            ctx.bot.gm(buffer)
                .out(...output.split(' '))
                .toBuffer('PNG', (error, buffer) => {
                    if (error) {
                        msg.delete();
                        return error
                    }
                    msg.delete();
                    ctx.reply({
                        files: [{
                            attachment: buffer,
                            name: 'domagick.png'
                        }]
                    });
                });
        }
    }
}