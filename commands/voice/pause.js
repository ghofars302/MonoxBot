module.exports ={
    description: 'Pause current track',
    category: 'Voice',
    cooldown: 2000,
    guildOnly: true,
    run: async function (ctx) {
        if (ctx.member.hasPermission('MANAGE_GUILD') || ctx.bot.utils.isAdmin(ctx.author.id)) {
            ctx.reply(`⏸ \`Pause current track. to continue use ${ctx.bot.config.prefix}play\``);
            return ctx.bot.voiceStreams.get(ctx.guild.id).pause();
        } else if (!ctx.member.voiceChannel || ctx.member.voiceChannel.id !== ctx.guild.me.voiceChannel.id) return ':x: `You cant start a vote when you\'re not in the voice channel!`'

        ctx.reply(`⏸ \`Pause current track. to continue use ${ctx.bot.confi.prefix}play\``);
        return ctx.bot.voiceStreams.get(ctx.guild.id).pause();
    }
}