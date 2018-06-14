const NekoAPI = require('../../const/nekos.json');

module.exports = {
	description: 'Pat someone or let me pat you..',
    category: 'fun',
    args: '(@Mentions | User)',
	run: async function (ctx, args, argsString) {
        const result = await this.rpromise({
            method: 'GET',
            uri: `https://nekos.life/api/v2${NekoAPI['pat']}`,
            headers: {
                'User-Agent': 'MonoxBot'
            },
            json: true
        });

        if (argsString) {
            if (!ctx.guild) return ctx.send('Looks you in DMChannel and i can\'t other users in this DM sorry about that.');
            const member = await this.utils.getMemberFromString(ctx, argsString);
            if (!member) return ctx.send(`:x: \`\`User ${argsString} not found.\`\``);

            const embed = new this.api.MessageEmbed()
            .setImage(result.url)
            .setDescription(`<@!${ctx.author.id}> Pats <@!${member.user.id}>, Awoooo`)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
    
            return await ctx.send(embed);
        }

        const embed = new this.api.MessageEmbed()
            .setImage(result.url)
            .setDescription(`Here let me pats you <@!${ctx.author.id}>`)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
    
        await ctx.send(embed);
	}
}