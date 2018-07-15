const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Get invite of this bot',
    category: 'Utils',
    cooldown: 60000,
    run: async function (ctx) {
        if (ctx.main.secret && !ctx.bot.utils.isAdmin(ctx.author.id)) return 'Sorry, but invite for this bot currently disable for development testing';

        const embed = new ctx.bot.api.MessageEmbed()
            .setTitle('MonoxBot Invite')
            .setDescription(stripIndent`
                [With Administrator](https://discordapp.com/api/oauth2/authorize?client_id=${ctx.main.user.id}&permissions=8&redirect_uri=https%3A%2F%2Fmonoxbot.glitch.me&scope=bot)
                [Without Administrator](https://discordapp.com/api/oauth2/authorize?client_id=${ctx.main.user.id}&permissions=522304&redirect_uri=https%3A%2F%2Fmonoxbot.glitch.me&scope=bot)

                Requested by ${ctx.author.tag}
            `)
            .setFooter('monoxbot.ga')
            .setTimestamp()

        return embed;
    }
}