module.exports = {
    description: 'Get meaning of your word in urban-dictionary',
    category: 'Utils',
    cooldown: 1000,
    args: '<Query>',
    run: async function (ctx, args, argsString) {
        if (!argsString) return `${ctx.bot.config.prefix}urban <Query>`;

        const res = await ctx.bot.rpromise({
            uri: 'http://api.urbandictionary.com/v0/define',
            qs: {
                term: argsString
            },
            json: true
        });

        if (res.result_type === 'no_results') return 'Nothing found';

        const urban = Upaginate(ctx, res.list);

        const msg = await ctx.reply(urban[1]);

        const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, urban.length);

        paginate.on('paginate', number => {
            msg.edit(urban[number]);
        });

        return true
    }
}

const Upaginate = (ctx, list) => {
    let pag = [];

    pag.push('number')

    for (const items of list) {
        const embed = new ctx.bot.api.MessageEmbed()
            .setTitle(items.word)
            .setURL(items.permalink)
            .setDescription(items.definition.length > 2048 ? items.definition.slice(0, 2000) : items.definition);
        
        if (items.example) embed.addField('Example', items.example.length > 1024 ? items.example.slice(0, 1000) : items.example);

        pag.push(embed);
    }

    return pag
}