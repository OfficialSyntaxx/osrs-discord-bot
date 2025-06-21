// commands/price.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('📈 Get current Grand Exchange price for an item')
    .addStringOption(opt =>
      opt
        .setName('item')
        .setDescription('Exact name of the item (e.g. Dragon dagger)')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt
        .setName('quantity')
        .setDescription('Quantity (default: 1)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const rawName = interaction.options.getString('item');
    const qty     = interaction.options.getInteger('quantity') || 1;

    // 1) Format for API: Title_Case_Underscore
    const apiName = rawName
      .trim()
      .split(/\s+/)
      .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join('_');

    const url = `https://api.weirdgloop.org/exchange/history/osrs/latest?name=${encodeURIComponent(apiName)}`;
    let json;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'OSRS-Manager-Bot/1.0 (github.com/your-repo)' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      json = await res.json();
    } catch (err) {
      console.error('Price → fetch error:', err);
      return interaction.editReply('❌ Could not fetch price data.');
    }

    // 2) Pick the returned entry (by key or first)
    const entry = json[apiName] || json[Object.keys(json)[0]];
    if (!entry || typeof entry.price !== 'number') {
      return interaction.editReply(`❌ No price found for **${rawName}**.`);
    }

    const { name, price, volume } = entry;
    const total = price * qty;

    // 3) Build Embed
    const embed = new EmbedBuilder()
      .setTitle(`📈 Grand Exchange: ${name}`)
      .addFields(
        { name: 'Price (each)', value: `${price.toLocaleString()} gp`, inline: true },
        ...(typeof volume === 'number'
          ? [{ name: 'Volume', value: `${volume.toLocaleString()}`, inline: true }]
          : []),
        { name: 'Quantity', value: `${qty}`, inline: true },
        { name: 'Total Cost', value: `${total.toLocaleString()} gp`, inline: true }
      )
      //.setFooter({ text: 'Source: GE Market Watch API' })
      .setColor(0x00CC66)
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
