// commands/calc-skills.js
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');
const fetch          = (...args) => import('node-fetch').then(m => m.default(...args));
const { levelToXp }  = require('../utils/levelToXp');
const skillMethods   = require('../data/skillMethods');

// 24 skills + the exact custom emoji names you uploaded
const SKILLS = [
  { key: 'attack',       emojiName: 'Attack_icon',       label: 'Attack' },
  { key: 'strength',     emojiName: 'Strength_icon',     label: 'Strength' },
  { key: 'defence',      emojiName: 'Defence_icon',      label: 'Defence' },
  { key: 'ranged',       emojiName: 'Ranged_icon',       label: 'Ranged' },
  { key: 'prayer',       emojiName: 'Prayer_icon',       label: 'Prayer' },
  { key: 'magic',        emojiName: 'Magic_icon',        label: 'Magic' },
  { key: 'hitpoints',    emojiName: 'Hitpoints_icon',    label: 'Hitpoints' },
  { key: 'crafting',     emojiName: 'Crafting_icon',     label: 'Crafting' },
  { key: 'mining',       emojiName: 'Mining_icon',       label: 'Mining' },
  { key: 'smithing',     emojiName: 'Smithing_icon',     label: 'Smithing' },
  { key: 'fishing',      emojiName: 'Fishing_icon',      label: 'Fishing' },
  { key: 'cooking',      emojiName: 'Cooking_icon',      label: 'Cooking' },
  { key: 'woodcutting',  emojiName: 'Woodcutting_icon',  label: 'Woodcutting' },
  { key: 'firemaking',   emojiName: 'Firemaking_icon',   label: 'Firemaking' },
  { key: 'fletching',    emojiName: 'Fletching_icon',    label: 'Fletching' },
  { key: 'agility',      emojiName: 'Agility_icon',      label: 'Agility' },
  { key: 'herblore',     emojiName: 'Herblore_icon',     label: 'Herblore' },
  { key: 'thieving',     emojiName: 'Thieving_icon',     label: 'Thieving' },
  { key: 'slayer',       emojiName: 'Slayer_icon',       label: 'Slayer' },
  { key: 'farming',      emojiName: 'Farming_icon',      label: 'Farming' },
  { key: 'runecrafting', emojiName: 'Runecraft_icon',    label: 'Runecrafting' },
  { key: 'hunter',       emojiName: 'Hunter_icon',       label: 'Hunter' },
  { key: 'construction', emojiName: 'Construction_icon', label: 'Construction' },
  { key: 'overall',      emojiName: 'Overall_icon',      label: 'Total' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc-skills')
    .setDescription('Show your skill tab and calculate XP/time/cost for a skill.')
    .addStringOption(opt =>
      opt.setName('username')
         .setDescription('Your OSRS username')
         .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('end_level')
         .setDescription('Target level (2–99)')
         .setRequired(true)
    ),

  // Slash command handler
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString('username');
    const endLevel = interaction.options.getInteger('end_level');

    // Build a global emoji map once
    const emojiMap = {};
    interaction.client.emojis.cache.forEach(e => {
      for (const s of SKILLS) {
        if (e.name === s.emojiName) emojiMap[s.key] = e;
      }
    });

    // Fetch WiseOldMan snapshot
    let skillsData;
    try {
      const res  = await fetch(
        `https://api.wiseoldman.net/v2/players/${encodeURIComponent(username.toLowerCase())}`
      );
      const json = await res.json();
      skillsData = json.latestSnapshot.data.skills;
    } catch {
      return interaction.editReply(`❌ Could not fetch data for **${username}**.`);
    }

    // Build 5x5 grid of icons+levels
    let grid = '';
    SKILLS.forEach((s, i) => {
      const lvl = skillsData[s.key]?.level?.toString().padEnd(2, ' ') || '--';
      const icon = emojiMap[s.key]?.toString() || `[${s.label.charAt(0)}]`;
      grid += `${icon}${lvl} `;
      if ((i + 1) % 5 === 0) grid += '\n';
    });

    // Create button rows
    const rows = [];
    for (let i = 0; i < SKILLS.length; i += 5) {
      const slice = SKILLS.slice(i, i + 5);
      const row   = new ActionRowBuilder();
      slice.forEach(s => {
        const btn = new ButtonBuilder()
          .setCustomId(`calc_${s.key}_${username}_${endLevel}`)
          .setStyle(ButtonStyle.Secondary);
        if (emojiMap[s.key]) {
          btn.setEmoji({ id: emojiMap[s.key].id, name: emojiMap[s.key].name });
        } else {
          btn.setLabel(s.label.charAt(0));
        }
        row.addComponents(btn);
      });
      rows.push(row);
    }

    // Send embed + buttons
    const embed = new EmbedBuilder()
      .setTitle(`${username}'s Skills • Total: ${skillsData.overall.level}`)
      .setDescription('```' + grid + '```')
      .setColor(0x00AEFF);

    return interaction.editReply({ embeds: [embed], components: rows });
  },

  // Button handler
  async handleButton(interaction) {
    await interaction.deferUpdate();

    const [ , key, user, end ] = interaction.customId.split('_');
    const endLevel = parseInt(end, 10);

    // Refetch snapshot
    let data;
    try {
      const r = await fetch(
        `https://api.wiseoldman.net/v2/players/${encodeURIComponent(user.toLowerCase())}`
      );
      const j = await r.json();
      data = j.latestSnapshot.data.skills;
    } catch {
      return interaction.editReply({
        content: `❌ Could not fetch for **${user}**.`,
        components: []
      });
    }

    const start = data[key]?.level;
    if (typeof start !== 'number' || start >= endLevel || endLevel > 99) {
      return interaction.editReply({ content: '❌ Invalid levels.', components: [] });
    }

    const xpNeeded = levelToXp(endLevel) - levelToXp(start);
    const methods  = skillMethods[key] || [];
    if (!methods.length) {
      return interaction.editReply({
        content: `⚠️ No methods for **${key}**.`,
        components: []
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`${SKILLS.find(s => s.key === key).label} Calculator`)
      .setColor(0xFFD700)
      .setTimestamp();

    for (const m of methods) {
      const unit  = m.itemsPerAction ? 'actions' : 'kills';
      const count = Math.ceil(xpNeeded / m.xp);
      const hrs   = (xpNeeded / m.xpPerHour).toFixed(2);

      let cost = 'N/A';
      if (m.itemId && m.itemsPerAction) {
        try {
          const pr  = await fetch(
            `https://prices.runescape.wiki/api/v1/osrs/latest?id=${m.itemId}`
          );
          const pj  = await pr.json();
          const low = pj.data[m.itemId].low || 0;
          cost = (count * m.itemsPerAction * low).toLocaleString() + ' gp';
        } catch {}
      }

      embed.addFields({
        name: m.name,
        value:
          `\`${count.toLocaleString()} ${unit}\`\n` +
          `⏳ ${hrs} hrs\n` +
          `💰 ${cost}`,
        inline: true
      });
    }

    return interaction.editReply({ embeds: [embed], components: [] });
  }
};
