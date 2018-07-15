module.exports = {
    description: 'Get meaning of your word in urban-dictionary',
    category: 'Utils',
    cooldown: 1000,
    args: '<Query>',
    run: async function (ctx, { argsString }) {
        if (!argsString) return `${ctx.prefix}urban <Query>`;

        const res = await ctx.bot.rpromise({
            uri: 'http://api.urbandictionary.com/v0/define',
            qs: {
                term: argsString
            },
            json: true
        });

        if (res.result_type === 'no_results') return 'Nothing found';

        const urban = UrbanEmbed(ctx, res.list);

        if (urban.length === 2) return urban[1];

        const msg = await ctx.reply(urban[1]);

        const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, urban.length);

        paginate.on('paginate', number => {
            msg.edit(urban[number]);
        });

        return true
    }
}

const UrbanEmbed = (ctx, list) => {
    let pag = [];
    let i = 0

    pag.push('Nothing here');

    for (const items of list) {
        const embed = new ctx.bot.api.MessageEmbed()
            .setTitle(items.word)
            .setURL(items.permalink)
            .setDescription(items.definition.length > 2048 ? items.definition.slice(0, 2000) : items.definition)

        if (items.example) embed.addField('Example', items.example.length > 1024 ? items.example.slice(0, 1000) : items.example);

        embed.addField('Thumbs', `👍 ${items.thumbs_up} 👎 ${items.thumbs_down}`)
        

        if (list.length > 1) {
            i = i + 1; // eslint-disable-line operator-assignment
            embed.setFooter(`Page ${i} of ${list.length}`);
        } else {
            embed.setFooter(`Page 1 of 1`);
        }

        pag.push(embed);
    }

    return pag
}