const MonoxCommand = require('../../const/MonoxCommand.js');

class AvatarCommand extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: [],
            group: 'others',
            memberName: 'avatar',
            description: 'get user avatar',
			throttling: {
				usages: 1,
				duration: 2.5
			}
        })
    }

    async run(msg, argString) {
        if (!argString) {
            let regexself = msg.author.displayAvatarURL().endsWith('.webp');
			
            if (regexself) {
                msg.channel.send('``' + msg.author.tag + '``\'s avatar. ' + msg.author.displayAvatarURL().slice(0, -5) + '.png?size=1024');
            } else {
                msg.channel.send('``' + msg.author.tag + '``\'s avatar. ' + msg.author.displayAvatarURL({
                    size: 1024
                }));
            }
        } else {
            if (msg.channel.type === 'dm') return msg.reply('Sorry, this command can\'t be use with Argument in DM');
			
            let member = await this.utils.getMemberFromString(msg, argString);
            if (!member) return msg.channel.send('⚠ ``User ' + argString + ' not found.``');
            let regexmember = member.user.displayAvatarURL().endsWith('.webp');
            if (regexmember) {
                msg.channel.send('``' + member.user.tag + '``\'s avatar. ' + member.user.displayAvatarURL({format: 'png', size: 1024}));
            } else {
                msg.channel.send('``' + member.user.tag + '``\'s avatar. ' + member.user.displayAvatarURL({
                    size: 1024
                }));
            }
        }
    }
}

module.exports = AvatarCommand;