module.exports = {
    description: 'Create a ',
    category: 'Fun',
    args: 'id <Message ID> | <Message content>',
    cooldown: 2000,
    run: async function (ctx, { args, argsString }) {
        let user = ctx.author;
        let member = null;
             
        const message = {
            content: argsString.replace(/<@!?(\d+)>/g, (match, id) => ctx.users.has(id) ? `[@${ctx.users.get(id).username}]` : match)
        };
       
        const IdOrNot = args[0].trim();
        
        if (IdOrNot.toLowerCase() === 'id') { 
            if (isNaN(args[1])) return ':x: `You must put message ID`'; 
            try {
                const messageObject = await ctx.channel.messages.fetch(args[1]);
                user = messageObject.author;
                message.content = messageObject.content.replace(/<@!?(\d+)>/g, (match, id) => ctx.users.has(id) ? `[@${ctx.users.get(id).username}]` : match)
 
            
                // if (messageObject.embeds) messageObject.embeds[0];
            } catch (error) { 
                return ':x: `Invalid message ID`' 
            } 
        }
    
        const author = {
            username: (ctx.guild && ctx.guild.member(user).nickname) ? ctx.guild.member(user).nickname : user.username,
            bot: user.bot,
            avatarURL: user.displayAvatarURL()
        }
    
        if (ctx.guild) {
            member = ctx.guild.member(user);
            author.color = `#${member.roles.highest.color.toString(16)})`;
        }
        
        const options = {
            args: {
                message,
                author,
                light: false,
                compact: false,
                timestamp: new Date()
               }
        }

        const buffer = await ctx.bot.fAPI('quote', options);

        return ctx.reply(
            {files: 
             [
                 {
                     name: 'quote.png', 
                     attachment: buffer
                 }
             ]
            }
        )                                         
    }
}

