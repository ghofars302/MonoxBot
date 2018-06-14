module.exports = function () {
    this.client.on('guildMemberAdd', (member) => {
        if (member.guild.id !== '440172556306087947') return;

        const channel = member.guild.channels.get('440172557040353282');

        channel.send(`<@${member.user.id}>, welcome to **MonoxBot dev server**. I hope you stay.`);
    });

    this.client.on('guildMemberRemove', (member) => {
        if (member.guild.id !== '440172556306087947') return;

        const channel = member.guild.channels.get('440172557040353282');

        channel.send(`**${member.tag}**, left cya.`);      
    })
}