const MonoxCommand = require('../../const/MonoxCommand.js');
const { MessageEmbed } = require('discord.js');

class RedditCommand extends MonoxCommand {
	constructor(client) {
		super(client, {
			name: 'reddit',
			aliases: ['rsub', 'redditsub'],
			group: 'others',
			memberName: 'reddit',
			description: 'Get random image from subreddit',
			examples: ['(Subreddits name)'],
			throttling: {
				usages: 1,
				duration: 5
			}
		})
	}
	
	async run(msg, args) {
		if (!args) return this.utils.invalidArgument(msg);

		try {
			let test = await this.axios.get(`https://reddit.com/r/${args}/about.json`);
			if (test.data.data.over18 && !msg.channel.nsfw) return msg.channel.send(':x: ``NSFW subreddit. please switch to channel tagged as NSFW to use this subReddit``');
				this.randomPuppy(args)
					.then(url => {
						if (!url) return msg.channel.send(':x: ``Image not found in return``');
						const embed = new MessageEmbed()
						embed.setTitle('Subreddit ' + args)
							.setURL(url)
							.setFooter('Reddit image search.', this.client.user.displayAvatarURL())
							.setImage(url);
						msg.channel.send(embed);
					})
		} catch (error) {
			msg.channel.send(':x: ``Error while gathering the Image``');
			console.log(error);
		}
	}
}

module.exports = RedditCommand;