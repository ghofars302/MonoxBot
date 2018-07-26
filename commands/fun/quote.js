const moment = require('moment');

module.exports = {
    description: 'Create Discord quote screenshot. ',
    category: 'Fun',
    args: 'id <Message ID> | <Message content>',
    cooldown: 2000,
    run: async function (ctx, { args, argsString }) {
        if (args.length === 0 || !argsString) return `\`\`\`${ctx.prefix}quote (id <MessageID> | @Mentions <Message Content> | <Message content>)\n\nSubcommands:\n- id <MessageID> (Use message id in current channel to quote message)\n- @Mentions <Message content> (Create a quote but author was another member/user)\n- <Message content> (Create quote based on your text) (Default)\n\nCreate discord quote screenshot\`\`\``;
        
        let user = ctx.author;
        let member = null;
        let userOMention;
        let timestamp = new Date();
        
        const regex = /<@!?(\d+)>/g
             
        const message = {
            content: argsString.replace(regex, (match, id) =>  ctx.guild.members.has(id)) ? `[@${ctx.guild.members.get(id).nickname}]` : ctx.users.has(id) ? `[@${ctx.users.get(id).username}]` : match)
        };
       
        const IdOrNot = args[0].trim();
        
        if (IdOrNot.toLowerCase() === 'id') { 
            if (isNaN(args[1])) return ':x: `You must put message ID`'; 
            try {
                const messageObject = await ctx.channel.messages.fetch(args[1]);
                user = messageObject.author;
                message.content = messageObject.content.replace(regex, (match, id) => ctx.guild.members.has(id)) ? `[@${ctx.guild.members.get(id).nickname}]`: ctx.users.has(id) ? `[@${ctx.users.get(id).username}]` : match)
                timestamp = message.createdTimestamp;
            
                // if (messageObject.embeds) messageObject.embeds[0];
            } catch (error) { 
                return ':x: `Invalid message ID`' 
            } 
        } else {
            userOMention = args.shift();
        }
        
        if (regex.test(userOMention)) {
            user = ctx.users.get(userOMention.replace(regex, (match, id) => ctx.users.has(id) ? id : ctx.author.id))
            message.content = args.join(' ');
        };
    
        const author = {
            username: (ctx.guild && ctx.guild.members.has(user.id) && ctx.guild.member(user).nickname) ? ctx.guild.member(user).nickname : user.username,
            bot: user.bot,
            avatarURL: user.displayAvatarURL()
        }
    
        if (ctx.guild) {
            member = ctx.guild.member(user);
            author.color = member.displayHexColor;
        }
        
        const options = {
            args: {
                message,
                author,
                light: false,
                compact: false,
               }
        }
        
        options.timestamp = moment(timestamp).calendar();

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

