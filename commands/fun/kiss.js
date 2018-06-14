const NekoAPI = require('../../const/nekos.json');

module.exports = {
	description: 'Kiss someone or yourself. idk what you love.',
    category: 'fun',
    args: '(@Mentions | User)',
	run: async function (ctx, args, argsString) {
        const result = await this.rpromise({
            method: 'GET',
            uri: `https://nekos.life/api/v2${NekoAPI['kiss']}`,
            headers: {
                'User-Agent': 'MonoxBot'
            },
            json: true
        });

        if (argsString) {
            if (!ctx.guild) return ctx.send('Looks you in DMChannel and i can\'t other users in this DM sorry about that.');
            const member = await this.utils.getMemberFromString(ctx, argsString);
            if (!member) return ctx.send(`:x: \`\`User ${argsString} not found.\`\``);
            if (member.user.id === ctx.author.id) return ctx.send(':x: ``You can\'t do it to yourself.``');

            const embed = new this.api.MessageEmbed()
            .setImage(result.url)
            .setDescription(`<@!${ctx.author.id}> Kiss <@!${member.user.id}>, What a couple`)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
    
            await ctx.send(embed);
            return;
        }

        const embed = new this.api.MessageEmbed()
            .setImage(result.url)
            .setDescription(`You kiss yourself?? <@!${ctx.author.id}>`)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
    
        await ctx.send(embed);
	}
}