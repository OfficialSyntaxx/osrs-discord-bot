// commands/list-usernames.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { listUserSlots }                     = require('../utils/userConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-usernames')
    .setDescription('Show your saved OSRS usernames (up to 3 slots)'),

  async execute(interaction) {
    const slots = listUserSlots(interaction.user.id);
    const embed = new EmbedBuilder()
      .setTitle('📋 Your Saved Usernames')
      .setColor(0x0099FF)
      .setTimestamp();

    slots.forEach((u, i) => {
      embed.addFields({
        name: `Slot ${i + 1}`,
        value: u ? `**${u}**` : '_empty_',
        inline: true
      });
    });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
