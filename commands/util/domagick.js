const MonoxCommand = require('../../const/MonoxCommand.js');

class DoMagick extends MonoxCommand {
    constructor(client) {
        super(client, {
            name: 'domagick',
            aliases: ['domagik'],
            group: 'util',
            memberName: 'domagick',
            description: 'ImageMagick command testing.',
            argsType: 'multiple',
        })
    }

    async run(msg, argArray) {
        if (msg.author.id !== this.config.owner) return msg.channel.send('Sorry, but this only for testing.');
        if (!argArray) return this.utils.infoTextBlock(msg, 'm!domagick (source) (argument)', 'Do testing in imageMagick');
        let source = await this.utils.getImagesFromMessage(msg, argArray);
        if (source.length === 0) return msg.channel.send(':warning: Unable to find image');
        this.gm(this.request(source[0]))
            .command('convert')
            .out(argArray[1])
            .toBuffer('PNG', function(err, buffer) {
                if (err) return msg.channel.send(':warning: Error while executing.. ```' + err + '```');
                msg.channel.send({files: [{name: 'fuckoff.png', attachment: buffer}]});
            });
    }
}

module.exports = DoMagick;