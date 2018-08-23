module.exports = {
    description: 'Get list of users who have same discriminator.',
    category: 'Utils',
    args: '[Number | Mention]',
    aliases: ['discrim'],
    cooldown: 1000,
    run: async function (ctx, { argsString }) {
        let discriminator = ctx.author.discriminator;

        if (argsString || ctx.message.mentions.users.size > 0) {
            if (!isNaN(argsString) || /^\d{4}$/.test(argsString)) {
                discriminator = argsString;
            } else if (ctx.message.mentions.users.size > 0) {
                discriminator = ctx.message.mentions.users.first().discriminator;
            } else {
                return ':x: `args must be Mentions or String number`';
            }
        }

        let resultArray = [];

        const results = await ctx.main.shard.broadcastEval(`this.users.filter(u => u.discriminator === '${discriminator}').map(u => u.tag)`);

        for (const shardResults of results) {
            for (const tag of shardResults)
                if (!resultArray.includes(tag)) resultArray.push(tag);
        }

        return `Found ${resultArray.length} users\`\`\`${resultArray.join('\n') || 'No matching user found.'}\`\`\``;
    }
}
