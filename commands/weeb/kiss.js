const MonoxCommand = require('../../const/MonoxCommand.js');

class KissCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'kiss',
            aliases: [],
            group: 'weeb',
            memberName: 'kiss',
            description: 'Kiss someone ( ͡° ͜ʖ ͡°)',
            examples: ['(@Mentions | User)'],
            throttling: {
                usages: 1,
                duration: 2
            }
        })
    }

    async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);
		
		let member = await this.utils.getMemberFromString(msg, args);
		if (!member) return msg.channel.send(':x: ``Member ' + args + ' not found.``');
        if (msg.author.id === member.user.id) return msg.channel.send('You think you can pat yourself?');
        
        this.fetch('https://nekos.life/api/v2/img/kiss')
            .then(res => res.json())
		      	.then( async json => {
			        let embed = new this.api.MessageEmbed();
			        embed.setTitle(msg.author.username  + ' Kiss ' + member.user.username)
			        	.setImage(json.url)
				    	.setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');
			    	await msg.channel.send(embed);
		      	});
    }
}

module.exports = KissCommand;