const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

const application = require('../database/models/application');
const ffUser = require('../database/models/freefire');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('download cheat')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('cheat')
        .setDescription('select cheat')
        .setMaxLength(10)
        .setRequired(true)
        .addChoices({ name: 'Free Fire', value: 'freefire' })
    ),
  async execute(interaction, client) {
    const findApplication = await application
      .findById(interaction.guildId)
      .exec();
    const findUser = await ffUser.findById(interaction.user.id).exec();

    if (!findUser)
      return interaction.reply({
        content: 'You does not have permission.',
        ephemeral: true,
      });

    const cheat = interaction.options.get('cheat').value;

    if (cheat === 'freefire') {
      let embed = new EmbedBuilder().setColor('#5D66E5').addFields(
        {
          name: 'Download Link',
          value: '```' + findApplication.ffDownloadLink + '```',
        },

        {
          name: 'Tutorial',
          value: '```' + 'https://streamable.com/7kpw9o' + '```',
        },
        { name: 'KEY', value: '```' + findApplication.key + '```' }
      );

      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
