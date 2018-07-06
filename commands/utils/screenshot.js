module.exports = {
    description: 'Take a screenshot on target URL(s)',
    aliases: ['ss'],
    cooldown: 5000,
    run: async function (ctx, args, argsString) {
        if (!argsString) return `\`\`\`${ctx.bot.config.prefix}screenshot <URLs>\n\nTake a screenshot on target URL(s)\`\`\``;

        const now = Date.now();

        try {
            const res = await ctx.bot.rpromise({
                method: 'POST',
                uri: 'https://monoxscreenshot.glitch.me/api',
                qs: {
                    key: process.env.KEY1,
                    url: argsString
                },
                json: true
            });

            const urls = res['URL'].length > 256 ? res['URL'].substring(0, 250) : res['URL'];

            const buffer = Buffer.from(res['BUFFER']['data'])
    
            const embed = new ctx.bot.api.MessageEmbed()
                .setTitle(urls)
                .setURL(res['URL'])
                .setFooter(`\⏰ Took ${Math.floor((Date.now() - now)/1000)}s`) // eslint-disable-line no-useless-escape
                .attachFiles([{
                    attachment: buffer,
                    name: 'screenshot.png'
                }])
                .setImage('attachment://screenshot.png');
    
            return await ctx.reply(embed);
        } catch (error) {
            return `:warning: \`\`Unable to take a screenshot on target URLs\`\`\n\`\`\`${error.message}\`\`\``;
        }        
    }
}