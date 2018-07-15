const {stripIndent} = require('common-tags');

module.exports = {
    description: 'Discover whats new update in this bot.',
    category: 'Utils',
    cooldown: 1000,
    run: function() {
        return stripIndent`
            \`\`\`
            Update in Monoxbot ${require('../../package.json')['version']}

            1.Pagination Update / NextPagination Update
                For best result add MANAGE_MESSAGES permission to MonoxBot permissions
                React ◀ to Back last page.
                React ▶ to Next page.
                React ⏹ to Stop pagination and delete message.
                React ℹ to Get help of pagination.
                React 🆕 to Get next content in a command (Only available at some commands)

            2.Message editing Update.
                From now bot will deleted invoked response (messages) if message author was
                Edited or deleted.
            \`\`\`
        `;
    }
}