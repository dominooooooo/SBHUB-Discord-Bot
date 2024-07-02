const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help using the SBHUB Bot!'),
	async execute(interaction) {
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x4CBB17)
			.setTitle('SBHUB')
			.setDescription('At the moment SBHUB Bot helps you only with recruiting for Piñata Festival!')
			.addFields({ name: 'How to Use', value: `Use command </festival:1257621565600825355> to get started and get more information there.` })
			.setFooter({ text: 'Made by @dominopoika' });

		await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
	},
};