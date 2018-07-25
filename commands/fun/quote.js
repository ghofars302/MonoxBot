module.exports = {
    description: 'Create a ',
    category: 'Fun',
    args: 'id <Message ID> | <Message content>',
    cooldown: 2000,
    run: async function (ctx, { args, argsString }) {
        let user = ctx.author;
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
    
        const author = {
            username: (ctx.guild && ctx.guild.member(author).nickname) ? cxt.guild.member(author).nickname : author.username;
            bot: author.bot,
            avatarURL: author.displayAvatarURL()
        }
    
        if (ctx.guild) {
            member = ctx.guild.member(author);
            author.color = member.role.first().color;
        }

        const buffer = await ctx.bot.fAPI('quote' {
                              args: {
                                            message,
                                            author,
                                            light: false
                                            compact; false,
                                            timestamp: new Date()
                                          }
                           }
        
                                          

    }
}
o
