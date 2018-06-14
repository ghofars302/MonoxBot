const NekoAPI = require('../../const/nekos.json');

module.exports = {
	description: 'Get a waifu(s) image from nekos.life',
	category: 'fun',
	run: async function (ctx) {
        const baseURL = 'http://nekos.life/api/v2';
        const result = await this.fetch(`${baseURL}${NekoAPI['waifu']}`);
        const json = await result.json();

        const embed = new this.api.MessageEmbed()
            .setImage(json.url)
            .setTitle(`Here random Waifu image(s) you wanted. `)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
    
        await ctx.send(embed);
	}
}