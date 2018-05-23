const MonoxCommand = require('../../const/MonoxCommand');

const os = require('os');
const moment = require('moment');
require('moment-duration-format');

class info extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'info',
            aliases: ['botinfo', 'statistic', 'botstats', 'stats'],
            group: 'util',
            memberName: 'info',
            description: 'Get bot Statistic.',
            throttling: {
                usages: 2,
                duration: 10
            }
        })
    }
    
    async run(msg) {
        const shardUsers = await this.client.shard.fetchClientValues('users.size');
        const shardGuilds = await this.client.shard.fetchClientValues('guilds.size');
		const totalGuilds = shardGuilds.reduce((p, v) => p + v, 0);
		const totalUsers = shardUsers.reduce((p, v) => p + v, 0);

        let DiscordJsVersion = require('discord.js')['version'];
        let CommandoVersion = require('discord.js-commando')['version'];
        let UptimeFormat = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        await msg.channel.send(
            `• CPU        :: ${os.cpus()[1].model}\n• CPU Usage  :: Null%\n• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n• Uptime     :: ${UptimeFormat}\n• Users      :: ${totalUsers}\n• Guilds     :: ${totalGuilds}\n• Discord.js :: v${DiscordJsVersion}\n• Commando   :: v${CommandoVersion}\n• Node       :: ${process.version}`,
            {
                code: "asciidoc"
            }
        );
    }
}

module.exports = info;