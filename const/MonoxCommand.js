const { Command } = require('discord.js-commando');
const GoogleClient = require('google-images');

const Utils = require('./utils.js');

class MonoxCommand extends Command {
	constructor(client, info) {
		super(client, info);
		
		this.utils = new Utils(this.client);
		this.config = require('../config/BotCfg.json');
		this.gm = require('gm').subClass({imageMagick: true});
		this.request = require('request');
		this.fetch = require('node-fetch');
		this.axios = require('axios');
		this.puppeteer = require('puppeteer');
		this.booru = require('booru');
		this.webdict = require('urban-dictionary');
		this.image = new GoogleClient(process.env.CSE, process.env.API);
		this.util = require('util');
		this.childprocess = require('child_process');
		this.sqlite = require('sqlite');
	}
}

module.exports = MonoxCommand;