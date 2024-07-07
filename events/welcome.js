module.exports = client => {

    client.on("guildMemberAdd", (member) => {
        const channelID = '1257439891633995820'
        const message = `<@${member.id}> liittyi palvelimelle!`
        const channel = member.guild.channels.cache.get(channelID)
        channel.send(message)
    })

    console.log("Successfully loaded welcome")
}