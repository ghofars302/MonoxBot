module.exports = {
    description: 'Regex for testing codeblock and remove the codeblock.',
    cooldown: 60000,
    run: async (ctx) => {
        const msg = await ctx.reply(page());

        const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, 2);

        paginate.on('paginate', number => {
            console.log(number);
            msg.edit(page(number));
        })
    }
}

const page = (num) => {
    if (!num || num === 1) return 'page one';
    return 'page two'
}

