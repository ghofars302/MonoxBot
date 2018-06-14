const NekoAPI = require('../../const/nekos.json');

module.exports = {
	description: 'Get random hentai image\n\nAvailabe tags: hentai, hentaigif, anal, lesbian',
    category: 'Nsfw',
    nsfw: true,
	cooldown: 5000,
	run: async function (ctx, args, argsString) {
        let query = 'hentai'
        if (argsString) {
            if (!['hentai', 'hentaigif', 'anal', 'lesbian'].includes(argsString)) return ctx.send(':x: ``Unknown tags``\n```List availabe tags: hentai, hentaigif, anal, lesbian.```');
            query = argsString;
        }

        const {body} = await ctx.bot.snekfetch.get(`https://nekos.life/api/v2${NekoAPI[query]}`);

        await ctx.send(new ctx.bot.api.MessageEmbed()
            .setTitle(`Here random ${query} image`)
            .setImage(body.url)
        )
    }
};

