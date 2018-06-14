module.exports = {
	description: 'Apply a magick effect on a image.',
	category: 'image-manipulation',
	args: '(@Mentions | User | URL)',
	run: async function (ctx, args, argsString) {
        if (!argsString) return this.messageHandler.invalidArguments(ctx);

        
        const result = await this.rpromise({
            method: 'GET',
            uri: `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(argsString)}`,
            headers: {
                'User-Agent': 'MonoxBot'
            },
            json: true           
        })
        const define = result.list;


        if (!Object.keys(define).length) return ctx.send('No result found.');

        if (!define[0].example) {
            ctx.send(new this.api.MessageEmbed()
                .setTitle(define[0].word)
                .setURL(define[0].permalink)
                .addField('Definition', define[0].definition.length > 1024 ? define[0].definition.substring(0, 1000) : define[0].definition)
                .setFooter('Urban Dictionary || 👍 ' + define[0].thumbs_up + ' 👎 ' + define[0].thumbs_down, 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA')
            )
        } else {
            ctx.send(new this.api.MessageEmbed()
                .setTitle(define[0].word)
                .setURL(define[0].permalink)
                .addField('Definition', define[0].definition.length > 1024 ? define[0].definition.substring(0, 1000) : define[0].definition)
                .addField('Example', define[0].example.length > 1024 ? define[0].example.substring(0, 1000) : define[0].example)
                .setFooter('Urban Dictionary || 👍 ' + define[0].thumbs_up + ' 👎 ' + define[0].thumbs_down, 'http://www.packal.org/sites/default/files/public/styles/icon_large/public/workflow-files/florianurban/icon/icon.png?itok=sMaOFyEA')
            )
        }
    }
}


