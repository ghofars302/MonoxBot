module.exports = {
    description: 'Take a screenshot on target URL(s)',
    aliases: ['ss'],
    category: 'Utils',
    cooldown: 2000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `\`\`\`${ctx.prefix}screenshot <URLs>\n\nTake a screenshot on target URL(s)\`\`\``;

        const now = Date.now();

        try {
            const res = await ctx.bot.fAPI('screenshot', {
                args: {
                    text: argsString
                }
            })

            const embed = new ctx.bot.api.MessageEmbed()
                .attachFiles([{
                    name: 'screenshot.png',
                    attachment: res
                }])
                .setImage('attachment://screenshot.png')
                .setFooter(`\⏰ Took ${Math.floor((Date.now() - now)/1000)}s`); // eslint-disable-line no-useless-escape

            return embed;
        } catch (error) {
            return `:warning: \`\`Unable to take a screenshot on target URLs\`\`\n\`\`\`${error.message}\`\`\``;
        }
    }
}