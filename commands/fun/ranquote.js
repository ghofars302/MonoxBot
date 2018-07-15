module.exports = {
    description: 'Get random quote.',
    category: 'Fun',
    cooldown: 5000,
    aliases: ['randomquote'],
    run: async function (ctx) {
        try {
            const res = await ctx.bot.rpromise({
                method: 'POST',
                uri: 'http://api.forismatic.com/api/1.0/',
                qs: {
                    method: 'getQuote',
                    key: '123456',
                    format: 'json',
                    lang: 'en'
                },
                json: true
            });

            const embed = new ctx.bot.api.MessageEmbed()
                .setDescription(`${res.quoteAuthor ? `${res.quoteAuthor}: ` : ''}${res.quoteText}`)

            return embed;
        } catch (error) {
            console.log(error) // eslint-disable-line no-console
            return 'There a error while calling the API';
        }
    }
}