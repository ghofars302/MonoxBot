module.exports = {
    description: 'Starts a vote to skip the current song',
    category: 'Voice',
    cooldown: 10000,
    guildOnly: true,
    run: async function (ctx, { args }) {
        if (!ctx.guild.me.voiceChannel || !ctx.bot.voiceStreams.has(ctx.guild.id) || !ctx.bot.playingSongs.has(ctx.guild.id)) return ':x: The bot isn\'t playing anything!'
        if (!ctx.bot.songQueues.get(ctx.guild.id) || !ctx.bot.songQueues.get(ctx.guild.id).length) return `:x: There no other song in queue, use \`\`${ctx.bot.config.prefix}leave\`\` to stop song.`
        const currentSong = ctx.bot.playingSongs.get(ctx.guild.id);

        if (currentSong.video.duration - (Date.now() - currentSong.startedAt) < 15000) return ':x: The song is ending in < 15s (Vote would take too long)'

        if (ctx.member.hasPermission('MANAGE_GUILD') && args[0] === '-force' || ctx.bot.utils.isAdmin(ctx.author.id) && args[0] === '-force') {
            const forced = await ctx.reply(':fast_forward: Sudo-Skipping current song');
            forced.delete({
                timeout: 5000
            });
            return ctx.bot.voiceStreams.get(ctx.guild.id).endsong('skip');
        } else if (!ctx.member.voiceChannel || ctx.member.voiceChannel.id !== ctx.guild.me.voiceChannel.id) return ':x: You cant start a vote when you\'re not in the voice channel!'


        let skipVote = await ctx.reply('Voting to skip song: react with ✅ to skip, react with ❎ to vote against skipping. ctx.bot vote will end in 5 seconds');
        await skipVote.react('✅');
        await skipVote.react('❎');

        const reactions = await skipVote.awaitReactions((reaction, user) => {
            if (!ctx.guild.member(user).voiceChannel) return false;
            if (!ctx.guild.me.voiceChannel) return false;
            return ctx.guild.member(user).voiceChannel.id === ctx.guild.me.voiceChannel.id;
        }, {
            time: 5000
        });

        skipVote.delete({
            timeout: 5000
        });

        const forVotes = reactions.has('✅') ? reactions.get('✅').users.size : 0;
        const againstVotes = reactions.get('❎') ? reactions.get('❎').users.size : 0;

        if (forVotes < againstVotes) return ':x: Not enough votes to skip song'

        skipVote.edit(':fast_forward: Skipping current song');
        if (ctx.bot.voiceStreams.has(ctx.guild.id)) ctx.bot.voiceStreams.get(ctx.guild.id).endsong('skip');
    }
};