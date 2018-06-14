require('colors');

module.exports = function () {
	this.client.on('error', (closeEvent) => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Connection closed (${closeEvent.message || 'No message supplied'})`); // eslint-disable-line no-console
		process.exit();
	});
};