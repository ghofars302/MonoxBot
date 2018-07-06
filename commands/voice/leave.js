module.exports = {
    description: 'Leaves the current voice channel and clears the song queue',
    category: 'Voice',
    cooldown: 1000,
    aliases: ['stop'],
    guildOnly: true,
    run: async function (ctx) {
        if (!ctx.member.hasPermission('MANAGE_GUILD') && !ctx.bot.utils.isAdmin(ctx.author.id)) return `:x: Only guild administrators can force the bot to leave. Either wait until all songs have finished playing, or use \`${ctx.bot.config.prefix}skip\` to skip them`

        const channel = ctx.guild.me.voiceChannel;
        if (!channel) return ':x: `I am not in voice channel!`'

        const queuedSongs = ctx.bot.songQueues.has(ctx.guild.id) ? ctx.bot.songQueues.get(ctx.guild.id).length : 0;
        ctx.bot.songQueues.delete(ctx.guild.id);

        if (ctx.bot.voiceStreams.has(ctx.guild.id)) {
            ctx.bot.voiceStreams.get(ctx.guild.id).endsong('leave');
            ctx.bot.voiceStreams.delete(ctx.guild.id);
        }

        channel.leave();
        return `:white_check_mark: \`Left voice channel, removed ${queuedSongs} songs from the queue\``
    }
};