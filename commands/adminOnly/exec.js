const {exec} = require('child-process-promise');

module.exports = {
    description: 'Evaluate system command line.',
    category: 'adminOnly',
    adminOnly: true,
    run: async function (ctx, args, argsString) {
        if (!argsString) return `\`\`\`${ctx.bot.config.prefix}exec <command line>\n\nEvaluate system command line.\`\`\``;

        const now = Date.now();

        try {
            const res = await exec(argsString);

            return `Exec output, Took: \`\`${Date.now() - now}ms\`\` \`\`\`xl\n${await res.stdout}\`\`\``;
        } catch (error) {
            return `Exec output, Took: \`\`${Date.now() - now}ms\`\` \`\`\`xl\n${error}\`\`\``;
        }
    }
}