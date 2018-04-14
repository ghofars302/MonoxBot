const commando = require('discord.js-commando');
const api = require('puppeteer');
const jimp = require('jimp');


class ScreenshotCommand extends commando.Command {
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
			examples: ['Nothing here :D'],
		});
	}

  async run(msg, argString) {
    if(!argString) return msg.channel.send('```m!ss (website link)\n\ntake a screenshot of website```')
		async function screenshot(value) {
			try {
				const browser = await api.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
				const page = await browser.newPage();
				await page.setViewport({width: 1920, height: 1080});
				await page.goto(value, {"waitUntil" : "networkidle0"});
				let result = await page.screenshot();
				jimp.read(result, function (error, images) {
					images.getBuffer(jimp.MIME_PNG, function (error, buffer) {
						msg.channel.send(({files: [{name: "screenshot.png", attachment: buffer}]}));
					});
				});
				msg.channel.stopTyping(true);
				await browser.close();
			} catch (error) {
				msg.channel.send(':warning: ``' + error + '``');
				console.error(error);
				msg.channel.stopTyping(true);
			}
		}
		msg.channel.startTyping();
		if(!this.client.utils.isURL(argString)) return screenshot("https://" + argString);
		screenshot(argString);
  }
};

module.exports = ScreenshotCommand;
