/* eslint-disable no-unused-vars */
require('dotenv').load();
const API = require('discord.js');
const SELF = require('./package.json');
const WEBHELPER = require('./http/app');
const CONFIG = require('./config/config.json');

const trueOrNot = process.env.webhelper === "true" ? true : false;
/* eslint-enable no-unused-vars */

class MonoxSharding { // eslint-disable-line no-unused-vars
	constructor() {
		this.init();
	}

	init() {
		const shardManager = new API.ShardingManager('./bot.js', { // eslint-disable-line no-unused-vars
			token: process.env.TOKEN
		});

		/* eslint-disable no-console */
		console.log(`[SHARD M] [Module] discord.js ${API.version} loaded.`);
		console.log(`[SHARD M] [MonoxBot Framework] MonoxBot ${SELF['version']} launching... `);
	
		if (trueOrNot) {
			new WEBHELPER();
			console.log(`[SHARD M] [WEBHELPER] Initializing Webhelper API at port 3000`);
		} else {
			console.log(`[SHARD M] [WEBHELPER] [WARNING] Webhelper API is disabled.`);
		}

		shardManager.spawn();
		console.log(`[SHARD M] [MANAGER] Initializing ${shardManager.totalShards.toString()} shards about ${(isNaN(shardManager.totalShards) ? 0 : shardManager.totalShards - 1) * 7.5}s`)
		/* eslint-enable no-console */
	}
}

new MonoxSharding();
