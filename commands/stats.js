const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function truncate(str, maxLength = 1900) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get OSRS stats for a player')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('OSRS username')
        .setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString('username');

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('category-select')
          .setPlaceholder('Select a category')
          .addOptions([
            { label: 'Skills', description: 'View all skills', value: 'skills' },
            { label: 'Overall Summary', description: 'View overall stats summary', value: 'overall' },
          ])
      );

    await interaction.reply({ content: `Select a category to view stats for **${username}**:`, components: [row], ephemeral: true });

    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
      componentType: 3, // StringSelectMenu
      time: 60000,
      filter: i => i.user.id === interaction.user.id,
    });

    collector.on('collect', async i => {
      const category = i.values[0];

      try {
        const res = await fetch(`https://api.wiseoldman.net/v2/players/${encodeURIComponent(username.toLowerCase())}`);
        if (!res.ok) {
          await i.update({ content: `❌ Player **${username}** not found or API error.`, components: [] });
          return;
        }
        const playerData = await res.json();
        if (!playerData.latestSnapshot) {
          await i.update({ content: `❌ No snapshots found for player **${username}**.`, components: [] });
          return;
        }
        const snapshot = playerData.latestSnapshot.data;

        let content = `**${username}** - ${category.charAt(0).toUpperCase() + category.slice(1)}:\n\n`;

        if (category === 'skills') {
          const skills = snapshot.skills;
          for (const skillName in skills) {
            const skill = skills[skillName];
            content += `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}:** Level ${skill.level}, XP ${skill.experience.toLocaleString()}\n`;
          }
        } else if (category === 'overall') {
          // Use playerData top-level info for overall stats summary
          const { exp, ehp, ttm, tt200m } = playerData;

          content += `**Total XP:** ${exp.toLocaleString()}\n`;
          content += `**Effective Hours Played (EHP):** ${ehp.toFixed(2)}\n`;
          content += `**Total Tasks Completed (TTM):** ${ttm.toFixed(2)}\n`;
          content += `**Total 200m XP Progress (TT200m):** ${tt200m.toFixed(2)}\n`;

          // Also total level from snapshot.skills.overall.level
          if (snapshot.skills && snapshot.skills.overall) {
            content += `**Total Level:** ${snapshot.skills.overall.level}\n`;
          }
        } else {
          content += 'Unknown category selected.';
        }

        content = truncate(content);

        await i.update({ content, components: [] });

      } catch (error) {
        console.error(error);
        await i.update({ content: '❌ Error fetching player data.', components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⌛ Selection timed out.', components: [] });
      }
    });
  },
};
