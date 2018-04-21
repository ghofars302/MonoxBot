const { Command } = require('discord.js-commando');

const utils = require('./utils.js');
const config = require('../config/BotCfg.json');

class MonoxCommand extends Command {
	constructor(client, info) {
		super(client, info);
		
		this.utils = new utils(this);
		this.config = config;
		this.gm = require('gm').subClass({imageMagick: true});
		this.request = require('request');
		this.fetch = require('node-fetch');
		this.axios = require('axios');
		this.puppeteer = require('puppeteer');
		this.randompuppy = require('random-puppy');
		this.webdict = require('urban-dictionary');
		this.util = require('util');
	}
}

module.exports = MonoxCommand;