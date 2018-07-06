module.exports = {
    description: 'Get list of user who have same discriminator.',
    category: 'Utils',
    args: '<number>',
    aliases: ['discrim'],
    cooldown: 1000,
    run: async function (ctx, args, argsString) {
        let discriminator = ctx.author.discriminator;

        if (argsString) {
            if (!/^\d{4}$/.test(argsString)) return ':x: `Format error: args must be number string`';
            discriminator = argsString;
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