const NekoAPI = require('../../const/nekos.json');

module.exports = {
	description: 'Get a catgirl(s)/neko(s) image from nekos.life',
	category: 'fun',
	args: '(neko or lewd or (nekogif or gif))',
	run: async function (ctx, args, argsString) {
        argsString = argsString.toLowerCase()
        const baseURL = 'http://nekos.life/api/v2';
        if (!argsString) argsString = 'neko';
        if (argsString === 'gif') argsString = 'nekogif';
        if (['neko', 'lewd', 'nekogif'].includes(argsString)) {
            if (argsString === 'lewd' && !ctx.channel.nsfw) return ctx.send('Oh no, You wanted lewd neko but this isn\'t NSFW channel, switch to NSFW channel now.');

            const result = await this.fetch(`${baseURL}${NekoAPI[argsString]}`);
            const json = await result.json();

            if (argsString === 'neko') argsString = 'Neko';
            if (argsString === 'lewd') argsString = 'Lewd Neko';
            if (argsString === 'nekogif') argsString = 'Neko (Animated gif)';

            const embed = new this.api.MessageEmbed()
                .setImage(json.url)
                .setTitle(`Here random ${argsString} image(s) you wanted. `)
                .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
            
            return ctx.send(embed);
        }
        return this.messageHandler.invalidArguments(ctx.message);
	}
}