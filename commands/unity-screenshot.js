const puppeteer = require('puppeteer');
exports.run = async (client, message, args, level) => {
    function isURL(value) {
      return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
    }
    const websitelink = args.join(" ");
    if(!websitelink.length > 5 && (isURL(websitelink))) return message.channel.send('```\nscreenshot | ss (website)\n\nscreenshot website in 1920x1080 -- command still in beta.```');
    (async () => {
      try {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});
        await page.goto(websitelink);
        await page.screenshot({path: 'tmp/screenshot.png'});
        message.channel.send({file:'./tmp/screenshot.png'});
        await browser.close();
      } catch (error) {
        message.channel.send(':warning: ``Invalid url or Website down``');
        client.logger.error(`Unhandled rejection: ` + error);
      }
    })();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ss'],
  permLevel: "Users"
};

exports.help = {
  name: "screenshot",
  category: "Unity",
  description: "Screenshot web page",
  usage: "screenshot (link)"
};
