require('colors');

module.exports = function () {
	this.client.on('ready', () => {
		console.log(`[SHARD ${this.client.shard.id}] ${'[READY]'.green} Ready for commands, servings ${this.client.guilds.size.toString().cyan} guilds`);
		this.client.user.setActivity('m!help ' + require('../package.json')['version'], {type: 'PLAYING'});
	})
}