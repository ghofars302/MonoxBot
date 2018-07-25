module.exports = {
    description: 'Create a ',
    category: 'Fun',
    args: 'id <Message ID> | <Message content>',
    cooldown: 2000,
    run: async function (ctx, { args, argsString }) {
        let user = ctx
        let member = null;
             
        const message = {
            content: argsString,
            embed: {}
        };
       
        const IdOrNot = args[0].trim();
        
        if (idOrNot.toLowerCase() === 'id') { 
            if (isNaN(args[1]) return ':x: `You must put message ID`'; 
            try {
                const messageObject = ctx.channel.messages.get(args[1]); 
                message.content = messageObject.content;
            
                if (message.Object.embeds) messageObject.embed[0];
            } catch (error) { 
                return ':x: `Invalid message ID`' 
            } 
        }
    
        if (ctx.guild) {
            member = ctx.guild.member(author);
            
        }

        const res = await ctx.bot.nekosapi.get('slap');

        const embed = new ctx.bot.api.MessageEmbed()
            .setDescription(userID === ctx.author.id || userID === ctx.main.user.id ? `Here let me slaps you <@!${ctx.author.id}>` : `<@!${ctx.author.id}> slapped <@!${userID}>, must be a real BAKA!!`)
            .setImage(res)
            .setFooter('Powered by nekos.life', 'https://nekos.life/static/icons/favicon-194x194.png');

        return embed
    }
}
o
