const { EmbedBuilder } = require('discord.js');
const User = require('./userSchema');

async function handlePinMessage(member) {
    const pinsChannelID = '1257626950638239836'; 
    const pinsChannel = member.guild.channels.cache.get(pinsChannelID);

    if (!pinsChannel) {
        console.error('Pins channel not found');
        return;
    }

    const userPins = await getUserPins(member.id);
    console.log(`User ${member.user.tag} has pins: ${userPins}`);

    const { imageUrl, text } = getImageAndTextBasedOnPins(userPins, member.user.tag);

    if (imageUrl && text) {
        const embed = new EmbedBuilder()
            .setTitle('Uusi pinssi kerätty!')
            .setDescription(text)
            .setImage(imageUrl)
            .setColor(0xDBBE67);

        pinsChannel.send({ content: `<@${member.user.id}>`, embeds: [embed] }).catch(console.error);
    } else {
        console.log('No valid pin found or no matching pin text/image.');
    }
}

async function getUserPins(userId) {
    const user = await User.findOne({ discordId: userId });
    if (user) {
        return user.pins;
    } else {
        console.log(`User with ID ${userId} not found in the database.`);
        return [];
    }
}

function getImageAndTextBasedOnPins(pins, userTag) {
    if (pins.includes('Ensiaskeleet')) {
        return {
            imageUrl: 'https://cdn.discordapp.com/attachments/1259509140615725133/1259509173914177659/Simple_Push_Pin_Circular_Logo_2.png?ex=668bf0d3&is=668a9f53&hm=a6434b126c53c67435c0fd45293cc000f7d8e2da7066935eb966097ea549c541&',
            text: `Olet kerännyt pinssin: **Ensiaskeleet**. Onneksi olkoon, ${userTag}!`
        };
    } else {
        return { imageUrl: null, text: null };
    }
}

module.exports = { handlePinMessage };
