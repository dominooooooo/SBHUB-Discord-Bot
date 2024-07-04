const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../userSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlink')
		.setDescription('Unlink your Squad Busters account!'),
	async execute(interaction) {
		const discordId = interaction.user.id;

		try {
			const result = await User.findOneAndDelete({ discordId });

			if (result) {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0xEE4B2B)
					.setDescription('Your Squad Busters account is unlinked!');

				await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
			} else {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0xFFEA00)
					.setDescription('No linked Squad Busters account found.');

				await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
			}
		} catch (error) {
			console.error('Error unlinking account', error);
			const exampleEmbed = new EmbedBuilder()
				.setColor(0xFFEA00)
				.setDescription('There was an error unlinking your account. Please try again later.');

			await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
		}
	},
};
