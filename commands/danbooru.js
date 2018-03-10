exports.run = async (client, message, args, level) => {
  if(!message.channel.nsfw) return message.channel.send(':underage: ``NSFW only``');
  const booru = require('booru')
  if(!args || args.length < 1) return message.channel.send('You must enter the tag before search for!');
  let tags = [args[0], args[1]];
  booru.search('danbooru', tags, {limit: 1, random: true})
  .then(booru.commonfy)
  .then(images => {
  for (let image of images) {
    message.channel.send({embed: {
            "title": "Danbooru Image search results",
            "description": "Score: **" + image.common.score + '**',
            "url": `http://danbooru.donmai.us/posts/` + image.common.id,
            "color": 12178570,
            "image": {
              "url": image.common.file_url
            }
      }});
   }
  })
   .catch(err => {
   if (err.name === 'BooruError') {
    message.channel.send('Can\'t find image you want: ``' + err.message + '``');
  } else {
     message.channel.send(err);
     console.log(err);
   }
 })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['dannsfw'],
  permLevel: "User"
};

exports.help = {
  name: "danbooru",
  category: "NSFW",
  description: "Search Image from danbooru.donmai.us",
  usage: "danbooru (tags)"
};
