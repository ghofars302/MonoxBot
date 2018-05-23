const MonoxCommand = require('../../const/MonoxCommand');

class Screenshot extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['ss'],
			group: 'others',
			memberName: 'screenshot',
			description: 'Take a screenshot from a website.',
			examples: ['(URL)'],
			throttling: {
				usages: 1,
				duration: 2.5
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);

		let message = await msg.channel.send('Ok, take screenshot now...')
		if (!this.utils.isHttp(args)) {
			return this.takeScreenshot(msg, 'http://' + args, message);
		} else {
			return this.takeScreenshot(msg, args, message);
		}
	}

	async takeScreenshot(msg, args, message) {
		try {
			const browser = await this.puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
			const page = await browser.newPage();
			await page.setViewport({width: 1920, height: 1080});
			await page.goto(args, {"waitUntil" : "networkidle0"});
			let buffer = await page.screenshot();

			await msg.channel.send(`:alarm_clock: Took \`\`${(message.createdTimestamp - msg.createdTimestamp) / 1000}sec\`\``, {files: [{
				attachment: buffer,
				name: 'screenshot.png'
			}]});

			await message.delete();
			await browser.close();
		} catch (error) {
			await message.delete();
		  	msg.channel.send(`:warning: \`\`Unable to take screenshot on Input URL\`\` \`\`\`js\n${error}\`\`\``);
		}
	}
}

module.exports = Screenshot;