module.exports = {
	description: 'Takes a screenshot of a web page',
	category: 'Utils',
	args: '(URL..)',
	aliases: ['ss', 'webshot'],
	cooldown: 3000,
	run: async function (ctx, args, argsString) {
        if (!argsString) return this.messageHandler.invalidArguments(ctx.message);
        let URLs = encodeURIComponent(argsString);
        let now = Date.now();
        let res = await this.fetch(`https://monoxscreenshot.glitch.me/api?key=${process.env.KEY1}&url=${URLs}`, {method: 'POST'});

        let json = await res.json();
        if (json['ERROR']) {
            return ctx.send(`:warning: \`\`Unable to take a screenshot on target URLs\`\`\n\`\`\`${json['ERROR']}\`\`\``);
        }

        let Title = json['URL'];

        if (json['URL'].length > 256) {
            Title = json['URL'].substring(0, 250);
        }

        let buffer = Buffer.from(json['BUFFER']['data']);
        const embed = new this.api.MessageEmbed()
            .setTitle(Title)
            .setURL(json['URL'])
            .setFooter(`\⏰ Took ${Math.floor((Date.now() - now)/1000)}s`)
            .attachFiles([{attachment: buffer, name: 'screenshot.png'}])
            .setImage('attachment://screenshot.png');

        await ctx.send(embed);
    }
};