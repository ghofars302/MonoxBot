const {stripIndent} = require('common-tags')
const {prefix} = require('../config/config.json');
const {version} = require('../package.json');

class stringUtils {
    static displayHelpPage(number) {
        const pageOne = stripIndent`
            \`\`\`
            MonoxBot ${version} commands list
            FUN...........Page number 2
            IMAGE.........Page number 3
            UTILS.........Page number 4
            VOICE.........Page number 5

            PS: You can see help for individual command by do ${prefix}help <Command>

            To paginate the help page react message below.
            \`\`\`
        `;

        const pageTwo = stripIndent`
            \`\`\`
            -==PAGE TWO==-

            ${prefix}hug [@Mentions | User]
            ${prefix}neko <Tag | sfw | nsfw | list>
            ${prefix}slap [@Mentions | User]
            ${prefix}kiss [@Mentions | User]
            ${prefix}cuddle [@Mentions | User]
            ${prefix}pat [@Mentions | User]
            ${prefix}feeding [@Mentions | User]
            ${prefix}owo <Message>

            // '<>' means must be a argument
            // '[]' means optional argument

            To paginate the help page react message below.
            \`\`\`
        `;

        const pageThree = stripIndent`
            \`\`\`
            -==PAGE THREE==-

            ${prefix}bobross [@Mentions | User | URL]
            ${prefix}gay [@Mentions | User | URL]
            ${prefix}glich [@Mentions | User | URL]
            ${prefix}steamcard [@Mentions | User | URL] [text]
            ${prefix}sharpen [@Mentions | User | URL]

            // '<>' means must be a argument
            // '[]' means optional argument

            To paginate the help page react message below.
            \`\`\`
        `;

        const pageFour = stripIndent`
            \`\`\`
            -==PAGE FOUR==-

            ${prefix}avatar <@Mentions | User>
            ${prefix}help [Command]
            ${prefix}info
            ${prefix}ping [URL]
            ${prefix}rex <Language> <code>
            ${prefix}screenshot <URL>
            ${prefix}undo
            ${prefix}users <@Mentions | User>
            ${prefix}beautify <JSCode>
            ${prefix}image <Query>
            ${prefix}clean <Limit> [Filter]
            ${prefix}urban <Query>

            // '<>' means must be a argument
            // '[]' means optional argument

            To paginate the help page react message below.
            \`\`\`
        `;

        const pageFive = stripIndent`
            \`\`\`
            -==PAGE FIVE==-

            ${prefix}play <Query | YoutubeURL>
            ${prefix}stop 
            ${prefix}pause 
            ${prefix}skip ['-force']
            ${prefix}queue

            // '<>' means must be a argument
            // '[]' means optional argument
        
            To paginate the help page react message below.
            \`\`\`
        `;

        if (!number) return pageOne;
        if (number === 1) return pageOne
        if (number === 2) return pageTwo
        if (number === 3) return pageThree
        if (number === 4) return pageFour
        if (number === 5) return pageFive
    }
}

module.exports = stringUtils;