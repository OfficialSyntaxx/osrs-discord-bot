// index.js
const fs   = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load slash commands
client.commands = new Collection();
for (const file of fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter(f => f.endsWith('.js'))
) {
  const cmd = require(path.join(__dirname, 'commands', file));
  client.commands.set(cmd.data.name, cmd);
}

// Button handler
const { handleButton } = require('./commands/calc-skills');

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd) await cmd.execute(interaction);
    }
    else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('❌ Error.');
    } else {
      await interaction.reply({ content: '❌ Error.', ephemeral: true });
    }
  }
});

client.login(token);
