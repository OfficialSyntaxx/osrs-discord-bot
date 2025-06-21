// commands/task.js
const {
    SlashCommandBuilder,
    EmbedBuilder
  } = require('discord.js');
  const fs   = require('fs');
  const path = require('path');
  
  const TASK_FILE = path.join(__dirname, '..', 'data', 'tasks.json');
  
  // Load existing tasks or return empty array
  function loadTasks() {
    if (!fs.existsSync(TASK_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASK_FILE, 'utf-8'));
  }
  
  // Save tasks back to disk
  function saveTasks(tasks) {
    fs.mkdirSync(path.dirname(TASK_FILE), { recursive: true });
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
  }
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('task')
      .setDescription('Manage your bot-farm tasks')
      .addSubcommand(sub =>
        sub
          .setName('add')
          .setDescription('Add a new task')
          .addStringOption(o =>
            o.setName('bot')
             .setDescription('Which bot/account')
             .setRequired(true)
          )
          .addStringOption(o =>
            o.setName('type')
             .setDescription('Task type (e.g. woodcutting)')
             .setRequired(true)
          )
          .addIntegerOption(o =>
            o.setName('duration')
             .setDescription('Duration in minutes')
             .setRequired(true)
          )
          .addStringOption(o =>
            o.setName('notes')
             .setDescription('Optional notes')
             .setRequired(false)
          )
      )
      .addSubcommand(sub =>
        sub.setName('list').setDescription('List all tasks')
      )
      .addSubcommand(sub =>
        sub
          .setName('complete')
          .setDescription('Mark a task as completed')
          .addIntegerOption(o =>
            o.setName('id')
             .setDescription('Task ID to complete')
             .setRequired(true)
          )
      ),
  
    async execute(interaction) {
      const sub = interaction.options.getSubcommand();
      const tasks = loadTasks();
  
      if (sub === 'add') {
        const bot      = interaction.options.getString('bot');
        const type     = interaction.options.getString('type');
        const duration = interaction.options.getInteger('duration');
        const notes    = interaction.options.getString('notes') || '';
        const id       = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
        const created  = new Date().toISOString();
  
        tasks.push({ id, bot, type, duration, notes, created, completed: false });
        saveTasks(tasks);
  
        return interaction.reply({
          content: `✅ Added task #${id}: **${bot}** → ${type} for ${duration}m.`,
          ephemeral: true
        });
      }
  
      if (sub === 'list') {
        if (!tasks.length) {
          return interaction.reply({ content: '📋 No tasks found.', ephemeral: true });
        }
        const embed = new EmbedBuilder()
          .setTitle('📝 Bot-Farm Tasks')
          .setColor(0x0099FF);
  
        tasks.forEach(t => {
          embed.addFields({
            name: `#${t.id} ${t.bot} [${t.completed ? '✅' : '⏳'}]`,
            value: `${t.type} • ${t.duration}m\nNotes: ${t.notes || '—'}`,
            inline: false
          });
        });
  
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
  
      if (sub === 'complete') {
        const id = interaction.options.getInteger('id');
        const idx = tasks.findIndex(t => t.id === id);
        if (idx < 0) {
          return interaction.reply({ content: `❌ Task #${id} not found.`, ephemeral: true });
        }
        tasks[idx].completed = true;
        saveTasks(tasks);
        return interaction.reply({ content: `✅ Task #${id} marked complete.`, ephemeral: true });
      }
    }
  };
  