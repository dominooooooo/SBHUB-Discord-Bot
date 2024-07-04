const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../userSchema');

//TESTI

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Squad Busters account!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('link')
            .setTitle('Link your Squad Busters account');

        const supercellIdInput = new TextInputBuilder()
            .setCustomId('scid')
            .setLabel("What's your Supercell ID?")
            .setPlaceholder('ProfilicDomino')
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(supercellIdInput);
        
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
    },

    async modalSubmit(interaction) {
        if (interaction.customId === 'link') {
            const supercellId = interaction.fields.getTextInputValue('scid');
            const discordId = interaction.user.id;

            try {
                await User.findOneAndUpdate(
                    { discordId },
                    { supercellId },
                    { upsert: true, new: true }
                );

				const exampleEmbed = new EmbedBuilder()
				.setColor(0x4CBB17)
				.setDescription('Your Squad Busters account is linked! Now use command </festival:1257621565600825355> to send a recruit!');

				await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });

            } catch (error) {
                console.error('Error saving to database', error);
                await interaction.reply({ content: 'There was an error linking your Supercell ID. Please try again later.', ephemeral: true });
            }
        }
    }
};
