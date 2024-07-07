require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const User = require('./userSchema');
const { handlePinMessage } = require('./pinHandler');
const { TOKEN, MONGODB_URI } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
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

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

client.on("guildMemberAdd", async (member) => {
    const roleID = '1259276534192013475';
    const role = member.guild.roles.cache.get(roleID);
    if (role) {
        member.roles.add(role).catch(console.error);
    }

    let user = await User.findOne({ discordId: member.id });
    if (!user) {
        user = new User({ discordId: member.id, pins: ['Ensiaskeleet'] });
    } else {
        if (!user.pins.includes('Ensiaskeleet')) {
            user.pins.push('Ensiaskeleet');
        }
    }
    await user.save();

    await handlePinMessage(client, member);
});

client.login(TOKEN);
