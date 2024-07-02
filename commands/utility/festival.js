const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
	cooldown: 7200,
	data: new SlashCommandBuilder()
		.setName('festival')
		.setDescription('Post a Piñata Festival recruitment message'),

async execute(interaction) {

	const modal = new ModalBuilder()
	.setCustomId('pinata')
	.setTitle('Piñata Festival recruitment');

	const pinataCountInput = new TextInputBuilder()
		.setCustomId('pinatacount')
		.setLabel("How many Piñata Sticks you have collected?")
		.setPlaceholder('0-1500')
		.setStyle(TextInputStyle.Short);

	const pinataInviteInput = new TextInputBuilder()
		.setCustomId('pinatainvite')
		.setLabel("Your Piñata Festival invite")
		.setPlaceholder('Paste your invite here (only link!)')  
		.setStyle(TextInputStyle.Short);

	const firstActionRow = new ActionRowBuilder().addComponents(pinataCountInput);
	const secondActionRow = new ActionRowBuilder().addComponents(pinataInviteInput);

	modal.addComponents(firstActionRow, secondActionRow);
	await interaction.showModal(modal);
	},
};