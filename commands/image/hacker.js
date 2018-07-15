module.exports = {
    description: 'Create a hacker scene with your text.',
    category: 'Image',
    cooldown: 5000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `\`\`\`${ctx.prefix}hacker <Text>\n\nCreate a hacker scene with your text.\`\`\``;

        const buffer = await ctx.bot.fAPI('hacker', {
            args: {
                text: argsString
            }
        });

        return ctx.reply({
            files: [{
                attachment: buffer,
                name: 'hacker.png'
            }]
        })
    }
}