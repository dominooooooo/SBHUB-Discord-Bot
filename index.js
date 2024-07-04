require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const User = require('./userSchema');
const { TOKEN, MONGODB_URI } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.cooldowns = new Collection();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// FESTIVAL MODAL RESPONSE
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'pinata') {
        try {
            const channel = interaction.guild.channels.cache.get("1257626950638239836");
            if (!channel) throw new Error('Channel not found');

            const exampleEmbed = new EmbedBuilder()
                .setColor(0x4CBB17)
                .setDescription('Your Piñata Festival recruitment was posted!');

            const pinatacount = interaction.fields.getTextInputValue('pinatacount');

            const user = await User.findOne({ discordId: interaction.user.id });

            if (!user) {
                throw new Error('User not found');
            }

            const exampleEmbed2 = new EmbedBuilder()
                .setColor(0x4CBB17)
                .setDescription(`${interaction.user.username} is recruiting for the Piñata Festival!`)
                .addFields({ name: `${interaction.user.username}'s Sticks`, value: `:ping_pong: ${pinatacount}` })
                .setTimestamp();

            const join = new ButtonBuilder()
                .setLabel('Join')
                .setURL(`https://link.squadbusters.com/en/JoinPinata/${user.supercellId}`)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder()
                .addComponents(join);

            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
            await channel.send({ content: `<@${interaction.user.id}>`, embeds: [exampleEmbed2], components: [row] });
        } catch (error) {
            console.error('Error handling pinata interaction:', error);
            await interaction.reply({ content: '**:white_check_mark: You need to paste link in this form**: \nhttps://link.squadbusters.com/en/AddFriend/. \n\n**:x: Not like this:** \nAdd me as a Friend in Squad Busters! https://link.squadbusters.com/en/AddFriend/', ephemeral: true });
        }
    }
});

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit()) {
        const command = require('./commands/utility/link');
        await command.modalSubmit(interaction);
    }
});

client.login(TOKEN);