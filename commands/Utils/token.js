const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Print information about provided DISCORD TOKEN',
    category: 'Utils',
    args: '<token>',
    cooldown: 1000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `Missing token`;
        let response;

        try {
            response = await ctx.bot.axios({
                method: 'GET',
                url: 'https://discordapp.com/api/v7/users/@me',
                headers: {
                    Authorization: argsString,
                }
            })
        } catch (error) {
            if (error.response.status === 401) return 'Invalid token';

            return 'Error while calling the API'
        }

        const embed = new ctx.bot.api.MessageEmbed()
            .setDescription(stripIndent`
                TOKEN: ${argsString}
                Tag: ${response.data.username}#${response.data.discriminator}
                ID: ${response.data.id}
                ${response.data.email ? `Email: ${response.data.email}` : ''}
                ${response.data.phone ? `Phone: ${response.data.phone}` : ''}
            `)

        return embed;
    }
}