module.exports = {
	description: 'Get some cat picture (Not catgirl)',
    category: 'fun',
	run: async function (ctx, args, argsString) {
        const result = await this.rpromise({
            method: 'GET',
            uri: `http://aws.random.cat/meow`,
            headers: {
                'User-Agent': 'MonoxBot'
            },
            json: true
        });

        const embed = new this.api.MessageEmbed()
            .setImage(result.file)
            .setDescription(`Here random cat image <@!${ctx.author.id}>`)
            .setFooter('Powered by random.cat', 'https://purr.objects-us-west-1.dream.io/static/ico/favicon-96x96.png');
    
        await ctx.send(embed);
	}
}