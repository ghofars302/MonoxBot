require('dotenv').load();

require('colors');
const { ShardingManager } = require('discord.js');

const ShardManager = new ShardingManager('./bot.js', {
	token: process.env.TOKEN,
	totalShards: 1
})
console.log(`${'[Shard M] [LAUNCH]'.red} Launching ${ShardManager.totalShards.toString().cyan} shards, going to take ${`~${(isNaN(ShardManager.totalShards) ? 0 : ShardManager.totalShards - 1) * 7.5}s`.cyan}`); // eslint-disable-line no-console
ShardManager.spawn()