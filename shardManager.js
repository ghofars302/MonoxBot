const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`${__dirname}/ShardScript.js`, { totalShards: 1, token: process.env.TOKEN });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));

process.on('unhandledRejection', (err) => {
  console.log('[Shard Manager] ' + (err && err.stack) || err);
});
