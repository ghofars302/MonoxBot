class GuildProvider {
    constructor(client, guild) {
        this.client = client;
        this.guild = guild;
    }

    getPrefix() {
        if (!this.client.provider) throw new Error('No provider available');

        const object = this.client.provider.get(this.guild.id);

        if (!object) return null;

        return object.prefix
    }

    setPrefix(value) {
        if (!this.client.provider) throw new Error('No provider available');
        
        return this.client.provider.set(this.guild.id, 'prefix', value);
    }
}

module.exports = GuildProvider;