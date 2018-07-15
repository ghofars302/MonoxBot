module.exports = {
    description: 'Regex for testing codeblock and remove the codeblock.',
    cooldown: 60000,
    run: async (ctx, { argsString }) => {
        const code = /(^```[a-z]*)|(```*$)/g.test(argsString) ? argsString.replace(/(^```[a-z]*)|(```*$)/g, '').trim() : argsString

        return code;
    }
}