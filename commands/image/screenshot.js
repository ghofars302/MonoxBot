const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class ScreenshotCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'screenshot',
			aliases: ['ss'],
			group: 'image',
			throttling: {
				usages: 1,
				duration: 15
			},
			memberName: 'screenshot',
			description: 'screenshot website xD',
		});
	}

	async run(msg, argString) {
		if (!argString) return msg.channel.send('```m!screenshot (url link || website url)\n\nTake screenshot from website.```');
		msg.channel.startTyping();
		if (!this.utils.isHttp(argString)) {
			this.TakeScreenshot(this.client, msg, 'http://' + argString);
		} else {
			this.TakeScreenshot(this.client, msg, argString);
		};
		msg.channel.stopTyping(true);
	}
	
	async TakeScreenshot(client, msg, value) {
		try {
			const browser = await this.puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
			const page = await browser.newPage();
			await page.setViewport({width: 1920, height: 1080});
			await page.goto(value, {"waitUntil" : "networkidle0"});
			let result = await page.screenshot();
			this.gm(result)
				.toBuffer('PNG', (err, buffer) => {
					if (err) return msg.channel.send(':warning: ``Unable to upload screenshot`` ```' + err + '```');
					msg.channel.send({files: [{name: 'screenshot.png', attachment: buffer}]})
				});
			await browser.close();
		} catch (error) {
		  	msg.channel.send(':warning: ``Unable to take screenshot.`` ```' + error + '```');
			console.log(error);
		}
	}
};

module.exports = ScreenshotCommand;
