module.exports = {
    description: 'Show all shards',
    category: 'Utils',
    cooldown: 1500,
    run: async function (ctx) {
        const shardPings = await ctx.main.shard.fetchClientValues('ping');
		const shardGuilds = await ctx.main.shard.fetchClientValues('guilds.size');
        const shardUsers = await ctx.main.shard.fetchClientValues('users.size');
        
        let list = '┌──────────┬───────────┬────────┬─────────┐\n';
		list += '│ Shard ID │ WS Ping   │ Guilds │ Users   │\n';
		list += '├──────────┼───────────┼────────┼─────────┤\n';

		for (let shardID = 0; shardID < ctx.main.shard.count; shardID++) {
			list += `│ ${shardID === ctx.main.shard.id ? '> ' : '  '}${shardID}${' '.repeat(6 - shardID.toString().length)} │ ${Math.round(shardPings[shardID])}ms${' '.repeat(7 - Math.round(shardPings[shardID]).toString().length)} │ ${shardGuilds[shardID]}${' '.repeat(6 - shardGuilds[shardID].toString().length)} │ ${shardUsers[shardID]}${' '.repeat(7 - shardUsers[shardID].toString().length)} │\n`;
		}

		const avgPing = Math.round(shardPings.reduce((p, v) => (p + v) / 2, shardPings[0]));
		const totalGuilds = shardGuilds.reduce((p, v) => p + v, 0);
		const totalUsers = shardUsers.reduce((p, v) => p + v, 0);

		list += '├──────────┼───────────┼────────┼─────────┤\n';
		list += `│ Total    │ ${avgPing}ms${' '.repeat(7 - avgPing.toString().length)} │ ${totalGuilds}${' '.repeat(6 - totalGuilds.toString().length)} │ ${totalUsers}${' '.repeat(7 - totalUsers.toString().length)} │\n`;
        list += '└──────────┴───────────┴────────┴─────────┘';
        
        return `\`\`\`xl\n${list}\`\`\``;
    }
}