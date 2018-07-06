const fs = require('fs');
const path = require('path');
const humanizeDuration = require('humanize-duration');
const postgres = require('pg'); 

class ResourceLoader {
	constructor(bot) {
		this.bot = bot;
	}
	
	loadCommands() {
		const commands = new this.bot.api.Collection();

		const loadCommandsIn = (dir) => {
			for (const subName of fs.readdirSync(dir)) {
				if (fs.statSync(path.resolve(dir, subName)).isDirectory()) {
					loadCommandsIn(path.resolve(dir, subName));
				} else {
					let file = path.resolve(dir, subName);
					let name = subName.substring(0, subName.lastIndexOf('.')).toLowerCase();

					if (require.cache[require.resolve(file)]) delete require.cache[require.resolve(file)];

					const command = require(file);
					command.name = name;
					commands.set(name, command);

					if (command.aliases)
						for (const alias of command.aliases)
							commands.set(alias, {
								alias: true,
								name: name
							});
				}
			}
		};

		loadCommandsIn('./commands/');

		return commands;
	}
	
	loadModules() {
		this.bot.gm = require('gm').subClass({imageMagick: true});
		this.bot.fetch = require('node-fetch');
		this.bot.fs = require('fs');
		this.bot.puppeteer = require('puppeteer');
		this.bot.childProcess = require('child_process');
		this.bot.ytdl = require('ytdl-core');
		this.bot.axios = require('axios');
		this.bot.hd = humanizeDuration.humanizer({
			languages: {
				youtube: {
					m: () => 'm',
					s: () => 's'
				}
			}
		});
		this.bot.util = require('util');
		this.bot.rpromise = require('request-promise');
		this.bot.snekfetch = require('snekfetch');
		this.bot.nekosapi = require('../modules/nekosAPI');
		this.bot.fetchapi = require('../modules/fetchAPI');
	}

	createDBInstance() {
		return new postgres.Pool({
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			max: 1,
			idleTimeoutMillis: 30000,
			ssl: true
		});
	}
}

module.exports = ResourceLoader;