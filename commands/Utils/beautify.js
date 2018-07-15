const { js_beautify: beautify } = require('js-beautify');

module.exports = {
    description: 'Make shit looks js code to beautify looks',
    category: 'Utils',
    args: '<Code>',
    cooldown: 1000,
    run: async function (ctx, { argsString }) {
        if (!argsString) return `\`\`\`${ctx.prefix}beautify <Code>\n\nMake shit looks js code to beautify looks\`\`\``;

        const content = /(^```js)|(```$)/g.test(argsString) ? argsString.replace(/(^```js)|(```$)/g, '').trim() : argsString;

        return `\`\`\`js\n${beautify(content)}\`\`\``
    }
}   