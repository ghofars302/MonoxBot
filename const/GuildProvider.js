class GuildProvider {
    constructor(client, guild) {
        this.client = client;
        this.guild = guild;
    }

    async getPrefix() {
        const prefixResult = await this.client.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', this.guild.id]);

        return prefixResult.rowCount > 0 ? prefixResult.rows[0].value : null;
    }

    async prefix(value, type) {
        try {
            await this.client.bot.utils.queryDB('DELETE FROM settings WHERE server = $1 AND setting = $2', [this.guild.id, 'prefix']);
            
            if (type === 'set') await this.utils.queryDB('INSERT INTO settings VALUES ($1, $2, $3)', [this.guild.id, 'prefix', value]);
        } catch (error) {
            throw error
        }
    }
}

module.exports = GuildProvider;