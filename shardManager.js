const { ShardingManager } = require('discord.js');
const auth = require('./config/auth.json')
const manager = new ShardingManager(`${__dirname}/ShardScript.js`, { totalShards: 1, token: auth.BotToken });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
