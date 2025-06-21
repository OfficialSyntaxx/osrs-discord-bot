// commands/set-username.js
const { SlashCommandBuilder } = require('discord.js');
const { setUserSlot }         = require('../utils/userConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-username')
    .setDescription('Save one of your 3 default OSRS usernames')
    .addIntegerOption(opt =>
      opt.setName('slot')
         .setDescription('Which slot (1–3)')
         .setRequired(true)
         .addChoices(
           { name: 'Slot 1', value: 1 },
           { name: 'Slot 2', value: 2 },
           { name: 'Slot 3', value: 3 }
         )
    )
    .addStringOption(opt =>
      opt.setName('username')
         .setDescription('Your exact OSRS username')
         .setRequired(true)
    ),

  async execute(interaction) {
    const slot     = interaction.options.getInteger('slot');
    const username = interaction.options.getString('username');

    setUserSlot(interaction.user.id, slot, username);
    return interaction.reply({
      content: `✅ Saved **${username}** into slot ${slot}.`,
      ephemeral: true
    });
  }
};
