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
			.addFields({ name: 'How to Use', value: `1. Use command </link:1258512104038600757> to link your Squad Busters account! \n2. After you have linked your account: use command </festival:1257621565600825355> to send a recruit! \n\nYou can always </unlink:1258512104038600758> your account and link it again.` })
			.setFooter({ text: 'Made by @dominopoika' });

		await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
	},
};