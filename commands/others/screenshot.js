const MonoxCommand = require('../../const/MonoxCommand');

class Screenshot extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['ss'],
			group: 'others',
			memberName: 'screenshot',
			description: 'Take an screenshot from a website.',
			throttling: {
				usages: 1,
				duration: 2.5
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.infoTextBlock(msg, 'm!screenshot (Website url)', 'Take an screenshot from a website.');
		if (!this.utils.isHttp(args)) {
			return this.utils.takeScreenshot(this.puppeteer, this.gm, msg, 'http://' + args);
		} else {
			return this.utils.takeScreenshot(this.puppeteer, this.gm, msg, args);
		}
	}
}

module.exports = Screenshot;