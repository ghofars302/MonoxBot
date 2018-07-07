const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Get random neko(s) from nekos.life',
    category: 'Fun',
    args: '<tag>',
    cooldown: 2500,
    aliases: ['nekos'],
    run: async function (ctx, args, argsString) {
        if (argsString) {
            const api = 'https://nekos.life/api/v2';

            argsString = argsString.toLowerCase();

            let URLs;
            let TagName;

            if (argsString === 'list') {
                return stripIndent`
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
                `
            } else if (argsString === 'sfw') {
                const type = Object.keys(sfw).random();

                const res = await ctx.bot.rpromise({
                    uri: api + sfw[type],
                    json: true
                });

                TagName = type;
                URLs = res.url;
            } else if (argsString === 'nsfw') {
                if (!ctx.isNSFW) return ':x: ``Nekos.life NSFW tags only can be used in Discord NSFW Channel``';
                const type = Object.keys(nsfw).random();

                const res = await ctx.bot.rpromise({
                    uri: api + nsfw[type],
                    json: true
                });

                TagName = type;
                URLs = res.url
            } else {
                if (Object.keys(sfw).includes(argsString) || Object.keys(nsfw).includes(argsString)) {
                    if (Object.keys(nsfw).includes(argsString) && !ctx.isNSFW) return ':x: ``Nekos.life NSFW tags only can be used in Discord NSFW Channel``';
                    const res = await ctx.bot.rpromise({
                        uri: api + (Object.keys(sfw).includes(argsString) ? sfw[argsString] : nsfw[argsString]),
                        json: true
                    });
    
                    TagName = argsString;
                    URLs = res.url
                } else {
                    return ':x: ``Unknown tag``';
                }
            }
            const embed = new ctx.bot.api.MessageEmbed()
                .setDescription(`Tag: **${TagName}**`)
                .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png')
                .setImage(URLs);

            return embed
        }

        return stripIndent`
            \`\`\`
            ${ctx.bot.config.prefix}neko <tag>

            Subcommands:
            -list <Get list available tags>
            -sfw <Random sfw tags>
            -nsfw <Random nsfw tags> <NSFW>

            Powered by nekos.life
            \`\`\`
        `
    }
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
    'foxgirl': '/img/foxgirl',
    'feed': '/img/feed',
    'cuddle': '/img/cuddle'
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
