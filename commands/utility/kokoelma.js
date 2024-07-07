const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../userSchema');

// Define pin emoji mapping
const pinEmoji = {
    Ensiaskeleet: '<:PinssiEnsiaskeleet:1259498967805333554>',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kokoelma')
        .setDescription('Näe keräämäsi pinssit!'),

    async execute(interaction) {
        const userPins = await getUserPins(interaction.user.id);

        const embed = new EmbedBuilder()
        .setTitle(`Käyttäjän ${interaction.user.tag} pinssikokoelma`)
        .setColor(0xDBBE67);
    
        let description = '';
        for (const pin of userPins) {
            if (pin in pinEmoji) {
                description += `${pinEmoji[pin]} ${pin}\n`;
            } else {
                description += `${pin} \n`;
            }
        }
        
        embed.setDescription(description);
        
        await interaction.reply({ embeds: [embed] });
    },
};

async function getUserPins(userId) {
    const user = await User.findOne({ discordId: userId });
    if (user) {
        return user.pins;
    } else {
        console.log(`User with ID ${userId} not found in the database.`);
        return [];
    }
}
