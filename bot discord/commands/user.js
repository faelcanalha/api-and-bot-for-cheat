const { SlashCommandBuilder } = require('discord.js');

const ffUser = require('../database/models/freefire');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('user add/remove')
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('select action')
        .setRequired(true)
        .setMaxLength(10)
        .addChoices(
          { name: 'add', value: 'add' },
          { name: 'remove', value: 'remove' }
        )
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('select user to remove or add')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('expiry')
        .setDescription('select expiry')
        .setMaxLength(10)
        .addChoices(
          { name: '1 Month', value: '1month' },
          { name: '3 Months', value: '3month' },
          { name: 'Permanent', value: 'permanent' }
        )
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    if (interaction.member.guild.ownerId != interaction.user.id)
      return interaction.reply({
        content: 'Only the server owner can perform this action.',
        ephemeral: true,
      });
    if (interaction.options.get('user').user.bot == true)
      return interaction.reply({
        content: 'User cannot be a bot.',
        ephemeral: true,
      });

    const userId = interaction.options.get('user').user.id;
    const action = interaction.options.get('action').value;
    const expiry = interaction.options.get('expiry')?.value;

    if (action === 'add') {
      if (!expiry)
        return interaction.reply({
          content: 'select expiry date',
          ephemeral: true,
        });

      const findUser = await ffUser.findById(userId);
      if (findUser)
        return await interaction.reply({
          content: 'This user is already registered.',
          ephemeral: true,
        });

      let date;
      switch (expiry) {
        case '1month':
          date = moment().add(30, 'day').toDate();
          break;
        case '3months':
          date = moment().add(90, 'day').toDate();
          break;
        case 'permanent':
          date = '9999-12-31T00:00:59.999+00:00';
          break;
        default:
          date = null;
      }

      await ffUser.create({
        _id: userId,
        expiry: date,
        createdBy: interaction.user.id,
      });

      return interaction.reply({
        content: 'User created successfully.',
        ephemeral: true,
      });
    }

    if (action === 'remove') {
      const findUser = await ffUser.findById(userId);
      if (!findUser)
        return await interaction.reply({
          content: 'User is not registered.',
          ephemeral: true,
        });

      await ffUser.deleteOne({
        _id: userId,
      });

      return interaction.reply({
        content: 'User deleted successfully.',
        ephemeral: true,
      });
    }
  },
};
