exports.run = async (client, message, args, level) => {
  if(!message.channel.nsfw) return message.channel.send(':underage: ``NSFW only``');
  const booru = require('booru')
  if(!args || args.length < 1) return message.channel.send('You must enter the tag before search for!');
  let tags = [args[0], args[1]];
  booru.search('rule34', tags, {limit: 1, random: true})
  .then(booru.commonfy)
  .then(images => {
  for (let image of images) {
    message.channel.send({embed: {
            "title": "Rule34 Image search results",
            "description": "Score: **" + image.common.score + '**',
            "url": `http://rule34.xxx/index.php?page=post&s=view&id=` + image.common.id,
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
  aliases: ['r34'],
  permLevel: "Users"
};

exports.help = {
  name: "rule34",
  category: "NSFW",
  description: "Search Image from rule34.xxx",
  usage: "rule34 (tags)"
};
