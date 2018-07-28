module.exports = {
    description: 'Search query on duckduckgo.com',
    args: '<Query>',
    aliases: ['ddg', 'ducksearch'],
    cooldown: 5000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `\`\`\`${ctx.prefix}duckduckgo <Query>\n\nSearch query on duckduckgo.com\`\`\``;

        const options = {
            method: 'POST',
            headers: {
                'Authorization': process.env.matmen,
                'Content-Type': 'application/json',
                'User-Agent': `MonoxFramework ${require('../../package.json')['version']} (MonoxBot)`
            }
        }
        
        options.body = JSON.stringify({
            args: {
                text: argsString
            }
        });

        const res = await ctx.bot.fetch('http://processing.matmen.me:3000/duckduckgo', options)

        const text = await res.json();

        if (!text.cards && text.results.length < 1) return 'Not found.'

        if (text['cards']) {
            const embed = new ctx.bot.api.MessageEmbed()
                .setTitle(text['cards']['title'])
                .setDescription(`${text['cards']['description']}`)

            return embed;
        } else {
            const msg = await ctx.reply(embedPage(ctx, text.results, 1));

            const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, Math.round(text.results.length) / 10 + 1, true);

            paginate.on('paginate', number => {
                msg.edit(embedPage(ctx, text.results, number));
            })
        } 
    }
}

const embedPage = (ctx, items, page) => {
    let i = 0 + page;

    let last = 10 * i;
    let first = last - 10;

    const embed = new ctx.bot.api.MessageEmbed()
        .setTitle('Search Results')
        .setDescription(items.slice(first, last).map(item => `${item.title}\n${item.link}`).join('\n')) // eslint-disable-line newline-per-chained-call
        .setFooter(`Page ${page} of ${items.length / 10}`)

    return embed;
}
