module.exports = {
    description: 'Regex for testing codeblock and remove the codeblock.',
    cooldown: 60000,
    hide: true,
    run: async (ctx) => {
        const msg = await ctx.reply('Page 1');

        const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, 21);

        paginate.on('paginate', number => {
            msg.edit(`Page ${number}`);
        })
    }
}

