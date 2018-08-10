let ytdl;
try {
    if (require.resolve('ytdl-core')) ytdl = require('ytdl-core');
} catch (error) {} // eslint-disable-line no-empty

module.exports = {
    description: 'Plays a song or adds it to the queue',
    category: 'Voice',
    args: '(query..)',
    cooldown: 10000,
    guildOnly: true,
    run: async function (ctx, { argsString }) {
        if (!argsString && !ctx.bot.voiceStreams.has(ctx.guild.id)) return ctx.bot.messageHandler.invalidArguments(ctx);

        if (!argsString && ctx.bot.voiceStreams.has(ctx.guild.id)) {
            ctx.bot.voiceStreams.get(ctx.guild.id).resume();
            return 'Resume current song'
        }

        const voiceChannel = ctx.member.voiceChannel;
        if (!voiceChannel) return ':x: `Please be in a voice channel first!`'
        if (!voiceChannel.permissionsFor(ctx.guild.me).has('CONNECT')) return ':x: `I don\'t have permissions to join your current voice channel!`'

        if (ctx.guild.me.voiceChannel && ctx.guild.me.voiceChannel.id !== voiceChannel.id) return ':x: `I am already playing in another channel!`'

        const body = await ctx.bot.rpromise({
            uri: 'https://www.googleapis.com/youtube/v3/search',
            qs: {
                type: 'video',
                part: 'snippet',
                q: argsString,
                key: process.env.youtubeApiKey
            },
            json: true
        });

        if (!body.items) return ':x: `The requested video could not be found!`'
        let video = body.items[0];

        if (!video) return ':x: `The requested video could not be found!`'

        const videoInfo = await ctx.bot.rpromise({
            uri: 'https://www.googleapis.com/youtube/v3/videos',
            qs: {
                id: video.id.videoId,
                part: 'contentDetails',
                key: process.env.youtubeApiKey
            },
            json: true
        });
        if (!videoInfo.items) return ':x: `The requested video could not be found!`'

        const pthms = videoInfo.items[0].contentDetails.duration;
        const duration = pthmsToMs(pthms);

        if (duration > 61 * 60 * 1000) return ':clock130: `Songs can\'t be longer than 60 minutes!`'

        const connnection = await voiceChannel.join();

        let playSong = url => {
            let endReason

            const stream = ytdl(url, {
                filter: 'audioonly'
            });

            const dispatcher = connnection.play(stream, {
                passes: 2
            });

            dispatcher.endsong = reason => {
                dispatcher.destroy();
                endReason = reason;
            }

            dispatcher.on('finish', () => {
                if (endReason === 'skip' && ctx.bot.playingSongs.has(ctx.guild.id)) ctx.bot.playingSongs.delete(ctx.guild.id)
                if (endReason === 'leave') {
                    ctx.bot.songQueues.delete(ctx.guild.id);
                    ctx.bot.voiceStreams.delete(ctx.guild.id);
                    ctx.bot.playingSongs.delete(ctx.guild.id);
                    return;
                }

                if (ctx.bot.songQueues.has(ctx.guild.id) && ctx.bot.songQueues.get(ctx.guild.id).length !== 0) {
                    let currentSong = ctx.bot.songQueues.get(ctx.guild.id)[0];

                    ctx.bot.playingSongs.set(ctx.guild.id, Object.assign(currentSong, {
                        startedAt: Date.now()
                    }));

                    playSong(currentSong.url);
                    ctx.reply(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${ctx.bot.hd(currentSong.video.duration, youtubeHdConfig)}]\`\nQueued by \`${ctx.bot.client.users.has(currentSong.user) ? ctx.bot.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
                    ctx.bot.songQueues.set(ctx.guild.id, ctx.bot.songQueues.get(ctx.guild.id).splice(1));
                } else {
                    ctx.reply(':stop_button: `No more songs in queue, leaving channel`');
                    ctx.bot.songQueues.delete(ctx.guild.id);
                    ctx.bot.voiceStreams.delete(ctx.guild.id);
                    ctx.bot.playingSongs.delete(ctx.guild.id);
                    voiceChannel.leave();
                }
            })

            ctx.bot.voiceStreams.set(ctx.guild.id, dispatcher);
        };

        let currentSong = {
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            user: ctx.author.id,
            video: {
                author: video.snippet.channelTitle,
                title: video.snippet.title,
                duration: duration
            }
        };

        if (ctx.bot.voiceStreams.has(ctx.guild.id)) {
            let queue = ctx.bot.songQueues.get(ctx.guild.id) || [];

            if (queue.filter((song) => song.url === currentSong.url).length > 0) return ctx.reply(`:x: this song is already queued. See the queued songs with \`${ctx.bot.config.prefix}queue\``);

            queue.push(currentSong);

            ctx.bot.songQueues.set(ctx.guild.id, queue);

            ctx.reply(`Added to queue: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${ctx.bot.hd(currentSong.video.duration, youtubeHdConfig)}]\`\n\nURL: <${currentSong.url}>`);
        } else {
            ctx.bot.playingSongs.set(ctx.guild.id, Object.assign(currentSong, {
                startedAt: Date.now()
            }));

            playSong(currentSong.url);
            ctx.reply(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${ctx.bot.hd(currentSong.video.duration, youtubeHdConfig)}]\`\nQueued by \`${ctx.bot.client.users.has(currentSong.user) ? ctx.bot.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
        }
    }
};

const youtubeHdConfig = {
    language: 'youtube',
    round: true,
    spacer: '',
    delimiter: ' '
};

const pthmsToMs = (pthms) => {
    const dRegex = /(\d+)D/;
    const hRegex = /(\d+)H/;
    const mRegex = /(\d+)M/;
    const sRegex = /(\d+)S/;
    let time = 0;

    time += dRegex.test(pthms) ? parseInt(pthms.match(dRegex)[1] * 60 * 60 * 24) : 0;
    time += hRegex.test(pthms) ? parseInt(pthms.match(hRegex)[1] * 60 * 60) : 0;
    time += mRegex.test(pthms) ? parseInt(pthms.match(mRegex)[1] * 60) : 0;
    time += sRegex.test(pthms) ? parseInt(pthms.match(sRegex)[1]) : 0;

    return time * 1000;
};
