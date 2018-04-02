const stripIndents = require('common-tags').stripIndents;
const commando = require('discord.js-commando');
const NekoClient = require('nekos.life');
const search = new NekoClient();

class NekoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'neko',
			aliases: [],
			group: 'image',
			memberName: 'neko',
			description: 'Get random neko',
			examples: ['neko kiss'],
			throttling: {
				usages: 1,
				duration: 2
			}
		});
	}

  async run(msg, argString) {
		msg.channel.startTyping();
		if (!argString) {
			msg.channel.send(':question: Nekos.life available Tags ```SFW: hug, kiss, pat, nekoSFW, meow, slap, tickle\n\nNSFW: anal, pussy, nekoNSFW, hentai, boobs, nekoNSFWGif, lesbian, cumsluts```');
			msg.channel.stopTyping(true);
		} else if (argString === 'anal') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWAnal().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Anal (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'hug') {
			search.getSFWHug().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Hug',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else if (argString === 'kiss') {
			search.getSFWKiss().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Kiss',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else if (argString === 'pussy') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWPussy().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Pussy (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'nekoNSFW') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWNeko().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Neko (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'nekoSFW') {
			search.getSFWNeko().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Neko',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else if (argString === 'hentai') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWRandomHentaiGif().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Hentai (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'pat') {
			search.getSFWPat().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Pat',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else if (argString === 'nekoNSFWGif') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWNekoGif().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Neko gif (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
	  } else if (argString === 'lesbian') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
			} else {
				search.getNSFWLesbian().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Lesbian (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'boobs') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWBoobs().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Boobs (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'cumsluts') {
			if (!msg.channel.nsfw) {
				msg.channel.send(':x: ``NSFW tag. can only used in channel tagged as NSFW``');
				msg.channel.stopTyping(true);
			} else {
				search.getNSFWCumsluts().then(images => msg.channel.send({embed: {
					title: 'Nekos.life Tag Cumsluts (NSFW)',
					image: {
						url: images.url
					},
					footer: {
						icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
						text: 'Powered by nekos.life'
					}
				}}));
				msg.channel.stopTyping(true);
			}
		} else if (argString === 'meow') {
			search.getSFWMeow().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Meow aka real cat',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else if (argString === 'slap') {
			search.getSFWSlap().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Slap',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
		} else if (argString === 'tickle') {
			search.getSFWTickle().then(images => msg.channel.send({embed: {
				title: 'Nekos.life Tag Tickle',
				image: {
					url: images.url
				},
				footer: {
					icon_url: "https://nekos.life/static/icons/favicon-194x194.png",
					text: 'Powered by nekos.life'
				}
			}}));
			msg.channel.stopTyping(true);
		} else {
			msg.channel.send(':x: ``Invalid tags.``');
			msg.channel.stopTyping(true);
		}
  }
};

module.exports = NekoCommand;
