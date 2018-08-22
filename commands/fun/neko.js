const { stripIndent } = require('common-tags');

module.exports = {
    description: 'Get random neko(s) from nekos.life',
    category: 'Fun',
    args: '<tag>',
    cooldown: 2500,
    aliases: ['nekos'],
    run: async function (ctx, { argsString }) {
        if (argsString) {
            argsString = argsString.toLowerCase();
            let TagName;

            if (argsString === 'list') return stripIndent `
                \`\`\`
                 SFW:        NSFW:
                -neko       -hentai
                -nekogif    -hentaigif
                -holo       -pussy
                -waifu      -nekohentaigif
                -slap       -nekohentai
                -lizard     -lesbian
                -meow       -kuni
                -pat        -cumsluts
                -poke       -classic
                -kiss       -lewd
                -hug        -boobs
                -foxgirl    -bj
                -feed       -anal
                -cuddle     -lewdk
                -waifu      -smallboobs
                            -funatari
                            -blowjob
                            -eroyuri
                            -yuri
                            -nsfwavatar
                            -trap
                            -spank

                To use those tags do: ${ctx.bot.config.prefix}neko <tags>
                \`\`\`
            `;

            if (argsString === 'sfw') TagName = 'sfw';

            if (argsString === 'nsfw') {
                if (!ctx.isNSFW) return ':x: `Nekos.life NSFW tags only can be used in Discord NSFW Channel`';
                TagName = 'nsfw'
            }

            if (!TagName) {
                const sfwList = Object.keys(sfw);
                const nsfwList = Object.keys(nsfw);

                if (sfwList.includes(argsString) || nsfwList.includes(argsString)) {
                    if (nsfwList.includes(argsString) && !ctx.isNSFW) return ':x: `Nekos.life NSFW tags only can be used in Discord NSFW Channel`';
                    TagName = argsString;
                } else {
                    return ':x: `Invalid tag`';
                }
            }

            const msg = await ctx.reply(await nekos(ctx, TagName));

            const isNext = ctx.bot.Paginate.initNext(msg, ctx.author);

            isNext.on('next', async () => {
                msg.edit(await nekos(ctx, TagName));
            });

            return true
        }

        return stripIndent `
            \`\`\`
            ${ctx.prefix}neko <tag>

            Subcommands:
            -list <Get list available tags>
            -sfw <Random sfw tags>
            -nsfw <Random nsfw tags> <NSFW>

            Powered by nekos.life
            \`\`\`
        `
    }
}

const nekos = async (ctx, tag) => {
    const sfwList = Object.keys(sfw);
    const nsfwList = Object.keys(nsfw);
    const api = 'https://nekos.life/api/v2';
    const nekos = tag === 'nsfw' ? nsfwList.random() : tag === 'sfw' ? sfwList.random() : tag;
    const url = nsfwList.includes(nekos) ? nsfw[nekos] : sfwList.includes(nekos) ? sfw[nekos] : 'undefined';

    const res = await ctx.bot.rpromise({
        uri: `${api}${url}`,
        json: true
    });

    if (res.msg === '404') return `Error: \`API path ${url} is not correct.\``;

    const embed = new ctx.bot.api.MessageEmbed()
        .setDescription(`Tag: **${nekos}**`)
        .setImage(res.url)
        .setFooter('Powered by nekos.life \nReact 🆕 to get new Image', 'https://nekos.life/static/icons/favicon-194x194.png');

    return embed;
}

const sfw = {
    'neko': '/img/neko',
    'nekogif': '/img/ngif',
    'holo': '/img/holo',
    'waifu': '/img/waifu',
    'slap': '/img/slap',
    'lizard': '/img/lizard',
    'meow': '/img/meow',
    'pat': '/img/pat',
    'kiss': '/img/kiss',
    'poke': '/img/poke',
    'hug': '/img/hug',
    'foxgirl': '/img/fox_girl',
    'feed': '/img/feed',
    'cuddle': '/img/cuddle',
    'smug': '/img/smug',
    'baka': '/img/baka'
}

const nsfw = {
    'hentai': '/img/hentai',
    'hentaigif': '/img/Random_hentai_gif',
    'pussy': '/img/pussy',
    'nekohentaigif': '/img/nsfw_neko_gif',
    'nekohentai': '/img/lewdkemo',
    'lesbian': '/img/lesbian',
    'kuni': '/img/kemo',
    'cum': '/img/cum',
    'classic': '/img/classic',
    'lewd': '/img/lewd',
    'boobs': '/img/boobs',
    'bj': '/img/bj',
    'anal': '/img/anal',
    'lewdk': '/img/lewdk',
    'smallboobs': '/img/smallboobs',
    'funatari': '/img/funatari',
    'blowjob': '/img/blowjob',
    'eroyuri': '/img/eroyuri',
    'yuri': '/img/yuri',
    'nsfwavatar': '/img/nsfw_avatar',
    'trap': '/img/trap',
    'spank': '/img/spank'
}
