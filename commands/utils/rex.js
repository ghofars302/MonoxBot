const {
    stripIndent
} = require('common-tags');
const API = require('../../modules/rex.json');

module.exports = {
    description: 'Evaluates code on rextester.com',
    category: 'Utils',
    args: '<Language> <Code>',
    ownerOnly: true,
    run: async function (ctx, { args }) {
        if (args.length < 1) return `\`\`\`${ctx.bot.config.prefix}rex <Language> <code>\n\nSubcommands:\n-list (Get rextester language supported-list)\n\nRun or test your code in rextester.com\`\`\``;

        const Lang = args.shift().toLowerCase();
        const code = args.join(' ');

        if (Lang.toLowerCase() === 'list') return stripIndent `
            \`\`\`
            Rextester language list:
            - C#            - Lisp          - Ocaml
            - VBNET         - Prolog        - Kotlin
            - F#            - Go            - Brainfuck
            - Java          - Scala         - Fortan
            - Python27      - Scheme
            - C             - Nodejs
            - C++           - Python3
            - Php           - Octave
            - Pascal        - Tcl
            - ObjectiveC    - MySql
            - Haskell       - PostgreSql
            - Ruby          - Oracle
            - Perl          - Swift
            - Lua           - Bash
            - Nasm          - Ada
            - SqlServer     - Erlang
            - Javascript    - Elixir
    
            To use those language do: ${ctx.prefix}rex <Language> <Code>
            \`\`\`
        `

        if (!Object.keys(API).includes(Lang)) return `:x: \`Unknown language, to get language list do: ${ctx.bot.config.prefix}rex list\``;

        try {
            const res = await ctx.bot.rpromise.post({
                uri: 'http://rextester.com/rundotnet/api',
                qs: {
                    LanguageChoice: API[Lang],
                    Program: /(^```[a-z]*)|(```*$)/g.test(code) ? code.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : code,
                    CompilerArgs: '-o a.out source_file.cpp'
                },
                json: true
            });

            return `\`\`\`js\n${res['Result'] ? ctx.bot.api.Util.escapeMarkdown(res['Result'], true, true) : res['Errors'] ? ctx.bot.api.Util.escapeMarkdown(res['Errors'], true, true) : 'Empty response'}\`\`\``;
        } catch (error) {
            return `:x: \`There a Error while calling the API\``;
        }
    }
};