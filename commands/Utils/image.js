module.exports = {
    description: 'Search images on google image search',
    category: 'Utils',
    args: '<Query>',
    aliases: ['im', 'img'],
    cooldown: 1000,
    run: async function (ctx, args, argsString) {
        if (!argsString) return `\`\`\`${ctx.bot.config.prefix}image (query)\n\nSearch images on google image search\`\`\``

        const api = 'https://www.googleapis.com/customsearch/v1'

        const embed = (number, list) => {
            return new ctx.bot.api.MessageEmbed()
                .setDescription(`Search result for query: **${argsString}** <Page \`${number}\` of \`${list.length}\`>`)
                .setImage(list[number])
                .setFooter('monoxbot.ga')
                .setTimestamp();
        }

        const config = {
            method: 'GET',
            uri: api,
            qs: {
                key: process.env.GoogleImageAPI1,
                cx: process.env.CSE,
                searchType: 'image',
                q: argsString,
                safe: 'off'
            },
            json: true
        }

        if (!ctx.isNSFW) config.qs.safe = 'high';

        try {
            let list = [];

            const res = await ctx.bot.rpromise(config);

            for (const thing of res.items) {
                list.push(thing.link);
            }

            const msg = await ctx.reply(embed(1, list));

            const paginate = ctx.bot.Paginate.initPaginate(msg, ctx.author, list.length, true);

            paginate.on('paginate', number => {
                msg.edit(embed(number, list));
            });

            return true
        } catch (error) {
            console.log(error) // eslint-disable-line no-console
            return 'There a error while calling the API, try again later';
        }
    }
}