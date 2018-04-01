const { ShardingManager } = require('discord.js');
const config = require('./config/BotCfg.json')
const manager = new ShardingManager(`${__dirname}/bot.js`, { totalShards: 1, token: config.token });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
