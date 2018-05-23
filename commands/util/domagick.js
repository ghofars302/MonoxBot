const MonoxCommand = require('../../const/MonoxCommand.js');

class DoMagick extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'domagick',
            aliases: ['domagik'],
            group: 'util',
            memberName: 'domagick',
            description: 'ImageMagick command testing.',
            examples: ['(User | @Mentions | URL) (ImageMagick arguments)'],
            ownerOnly: true
        })
    }

    async run(msg, args) {
        if (!args) return this.utils.invalidArgument(msg);

        let argsSplit = this.utils.splitArgs(args);

        let source = await this.utils.getImagesFromMessage(msg, argsSplit);
        if (source.length === 0) return msg.channel.send(':warning: Unable to find image');

        let output = `${args.slice(argsSplit[0].length)}`;
        let content = await this.axios.get(source[0]);
		let mimeType = content['headers']['content-type'];

        if (mimeType === 'image/gif') {
            this.gm(this.request(source[0]))
                .out(...output.split(' '))
                .toBuffer('GIF', function(err, buffer) {
                    if (err) {
                        return msg.channel.send(`:warning: \`\`Imagemagick failed\`\` \`\`\`${err}\`\`\``);
                    }
                    if (buffer.length > 8388353) {
                        return msg.channel.send(':x: ``File is too big (> 8MB)``')
                    }
                    msg.channel.send({files: [{name: 'fuckoff.gif', attachment: buffer}]})
                })
        } else {
            this.gm(this.request(source[0]))
                .out(...output.split(' '))
                .toBuffer('PNG', function(err, buffer) {
                    if (err) {
                        return msg.channel.send(`:warning: \`\`Imagemagick failed\`\` \`\`\`${err}\`\`\``);
                    }
                    if (buffer.length > 8388353) {
                        return msg.channel.send(':x: ``File is too big (> 8MB)``')
                    }
                    msg.channel.send({files: [{name: 'fuckoff.png', attachment: buffer}]})
                })
        }
    }
}

module.exports = DoMagick;