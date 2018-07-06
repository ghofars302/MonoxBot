const {stripIndent} = require('common-tags');

const moment = require("moment");
require("moment-duration-format");

module.exports = {
    description: 'Get bot information',
    category: 'Utils',
    cooldown: 5000,
    run: async function (ctx) {
        const now = Date.now()
        const shardGuilds = await ctx.main.shard.fetchClientValues('guilds.size');
        const shardUsers = await ctx.main.shard.fetchClientValues('users.size');

        const totalUsers = shardUsers.reduce((p, v) => p + v, 0);
        const totalGuilds = shardGuilds.reduce((p, v) => p + v, 0);

        const duration = moment.duration(ctx.main.uptime).format(" D [D], H [H], m [M]");

        const embed = new ctx.bot.api.MessageEmbed()
            .setTitle('MonoxBot information.')
            .setDescription(stripIndent`
                Author: \`\`Monox#0934 <344754852989108226>\`\`
                Lib: \`\`Discord.js ${ctx.bot.api.version}\`\`
                Node: \`\`${process.version}\`\`
                \`\`\`js
                BotStats {
                    Guilds: ${totalGuilds}
                    Users: ${totalUsers}
                    CurrentShard: ${ctx.main.shard.id}
                    Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
                    Uptime: ${duration}
                    ping: {
                        websocket: ${Math.round(ctx.main.ping)}ms
                        message: ${Date.now() - now}ms
                    }
                }
                \`\`\`
            `)
            .setThumbnail(ctx.main.user.displayAvatarURL())
            .setTimestamp()
            .setFooter('monoxbot.ga', ctx.main.user.displayAvatarURL());

        return ctx.reply(embed);
    }
}