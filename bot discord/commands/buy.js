const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('send buy button')
    .setDMPermission(false),
  async execute(interaction, client) {
    if (interaction.member.guild.ownerId != interaction.user.id) {
      return interaction.reply({
        content: 'Only the server owner can perform this action.',
        ephemeral: true,
      });
    }

    let embed = new EmbedBuilder().setColor('#5D66E5').setDescription(`
    🇵🇹 🇧🇷 
**Regras**
\`1.\` Reembolso só será tolerado até o final do dia.
\`2.\` O compartilhamento de contas é estritamente proibido.
\`3.\` Tentativas de Cracking, Reverser são estritamente proibidas.
\`4.\` A revenda é permitida apenas para usuários com o cargo <@&1088021587845984338> (se você estiver interessado em se tornar um revendedor, entre em contato com  <@312392041403383810>)
> **Observação: Quebrar qualquer uma das regras acima resultará em punição apropriada.**

🇬🇧 🇺🇸
**Rules**
\`1.\` Refund will only be tolerated until the end of the day.
\`2.\` Sharing of accounts is strictly prohibited.
\`3.\` Attempts to crack accounts are strictly forbidden.
\`4.\` Reselling is only allowed by users with the role <@&1088021587845984338> (If you are interested in becoming a reseller, contact <@312392041403383810>)
> **Note: Breaking any of the above rules will result in appropriate punishment.**`);

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('freefire')
        .setLabel('FREE FIRE')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('valorant')
        .setLabel('VALORANT')
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('fivem')
        .setLabel('FIVEM')
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
    );
    interaction.reply({ embeds: [embed], components: [row] });
  },
};
