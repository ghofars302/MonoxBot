const youtubeHdConfig = {
    language: 'youtube',
    round: true,
    spacer: '',
    delimiter: ' '
};

module.exports = {
    description: 'Replies with the current queue',
    category: 'Voice',
    cooldown: 1000,
    guildOnly: true,
    run: async function (ctx) {
        const queue = ctx.bot.songQueues.get(ctx.guild.id);

        if (!queue || queue.length === 0) return `The song queue is empty, add songs using \`${ctx.bot.config.prefix}play\``

        let reply = 'Song queue:\n';

        let id = 0;
        for (const song of queue.slice(0, 10)) {
            id++;
            reply += `**${id}**: \`${song.video.title}\` by \`${song.video.author}\` \`[${ctx.bot.hd(song.video.duration, youtubeHdConfig)}]\` - Queued by \`${ctx.users.has(song.user) ? ctx.users.get(song.user).tag : 'Unknown#0000'}\`\n`;
        }
        if (queue.length > 10) reply += `\`+ ${queue.length - 10} more\``;

        return reply
    }
};