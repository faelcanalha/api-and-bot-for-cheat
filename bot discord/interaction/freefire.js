const {
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require('discord.js');

const paypal = require('paypal-rest-sdk');
const Payload = require('node-pix-payload');

require('dotenv');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

let plan;
let copyandpaste;
const ff = require('../database/models/freefire');

function pay(price, description, user) {
  const payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    transactions: [
      {
        amount: {
          total: price,
          currency: 'BRL',
        },
        description: description,
      },
    ],
    redirect_urls: {
      return_url: `https://softcc.store/api/payment/paypal/sucess?userId=${user}`,
      cancel_url: 'https://softcc.store/api/payment/paypal/cancel',
    },
  };
  return payment;
}

async function freefire(interaction, client) {
  if (interaction.customId === 'freefire') {
    const findUser = await ff.findById(interaction.user.id);
    if (findUser)
      return interaction.reply({
        content:
          "We appreciate you as a current customer! If you're interested in switching plans, please wait until your current plan has ended before making any changes. We're here to help you with any questions or concerns you may have during this process.",
        ephemeral: true,
      });
  }

  if (interaction.customId === 'freefire') {
    if (interaction.isButton()) {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('plan')
          .setPlaceholder('Nothing selected')
          .addOptions(
            {
              label: '1 Month',
              description: 'R$ 49,99',
              value: '1month',
            },
            {
              label: '3 Months',
              description: 'R$ 124,99',
              value: '3months',
            },
            {
              label: 'Permanent',
              description: 'R$ 249,99',
              value: 'permanent',
            }
          )
      );
      await interaction.reply({
        content: 'Please select the desired plan',
        components: [row],
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === 'plan') {
    if (interaction.isStringSelectMenu()) {
      const selected = interaction.values[0];

      if (selected) {
        plan = selected;
        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('price')
            .setPlaceholder('Nothing selected')
            .addOptions(
              //{
              //label: 'PayPal',
              //value: 'paypal',
              //},
              {
                label: 'Pix',
                value: 'pix',
              }
            )
        );

        await interaction.deferUpdate();
        await interaction.editReply({
          content: 'Please select a payment method',
          components: [row],
          ephemeral: true,
        });
      }
    }
  }

  if (interaction.customId === 'price') {
    if (interaction.isStringSelectMenu()) {
      const selected = interaction.values[0];

      if (selected === 'paypal') {
        if (plan === '1month') {
          paypal.payment.create(
            pay('49.99', '1month', interaction.user.id),
            async function (error, payment) {
              if (error) {
                console.log(error);
              } else {
                for (let i = 0; i < payment.links.length; i++) {
                  if (payment.links[i].rel === 'approval_url') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                      content: `Please complete your payment here: ${payment.links[i].href}`,
                      ephemeral: true,
                      components: [],
                    });
                  }
                }
              }
            }
          );
        }

        if (plan === '3months') {
          paypal.payment.create(
            pay('124.99', '3months', interaction.user.id),
            async function (error, payment) {
              if (error) {
                console.log(error);
              } else {
                for (let i = 0; i < payment.links.length; i++) {
                  if (payment.links[i].rel === 'approval_url') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                      content: `Please complete your payment here: ${payment.links[i].href}`,
                      ephemeral: true,
                      components: [],
                    });
                  }
                }
              }
            }
          );
        }

        if (plan === 'permanent') {
          paypal.payment.create(
            pay('249.99', 'permanent', interaction.user.id),
            async function (error, payment) {
              if (error) {
                console.log(error);
              } else {
                for (let i = 0; i < payment.links.length; i++) {
                  if (payment.links[i].rel === 'approval_url') {
                    await interaction.deferUpdate();
                    await interaction.editReply({
                      content: `Please complete your payment here: ${payment.links[i].href}`,
                      ephemeral: true,
                      components: [],
                    });
                  }
                }
              }
            }
          );
        }
      }

      if (selected === 'pix') {
        if (plan === '1month') {
          const payload = Payload.setPixKey(
            '585cb0a1-7d5d-4ac8-bb61-a9f906e4fb24'
          )
            .setDescription('Free Fire - 1 Month')
            .setMerchantName('SOFT.CC')
            .setMerchantCity('PARANA')
            .setAmount('49.99')
            .setTxid('***')
            .setUniquePayment(true);

          const data = await payload.getData();

          const sfbuff = new Buffer.from(
            data.qrcode_payload.split(',')[1],
            'base64'
          );
          const sfattach = new AttachmentBuilder(sfbuff, 'output.png');

          copyandpaste = data.text_payload;
          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('sendPixCopyPaste')
              .setLabel('COPY AND PASTE')
              .setStyle(ButtonStyle.Primary)
          );

          await interaction.deferUpdate();
          await interaction.editReply({
            content: `Please complete your payment:\nType: Free Fire - 1 Month\n\nAfter making the payment, open a <#1088019364382511205> and send the receipt`,
            ephemeral: true,
            components: [row],
            files: [sfattach],
          });
        }

        if (plan === '3months') {
          const payload = Payload.setPixKey(
            '585cb0a1-7d5d-4ac8-bb61-a9f906e4fb24'
          )
            .setDescription('Free Fire - 3 Months')
            .setMerchantName('SOFT.CC')
            .setMerchantCity('PARANA')
            .setAmount('124.99')
            .setTxid('***')
            .setUniquePayment(true);

          const data = await payload.getData();

          const sfbuff = new Buffer.from(
            data.qrcode_payload.split(',')[1],
            'base64'
          );
          const sfattach = new AttachmentBuilder(sfbuff, 'output.png');

          copyandpaste = data.text_payload;
          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('sendPixCopyPaste')
              .setLabel('COPY AND PASTE')
              .setStyle(ButtonStyle.Primary)
          );

          await interaction.deferUpdate();
          await interaction.editReply({
            content: `Please complete your payment:\nType: Free Fire - 3 Months\n\nAfter making the payment, open a <#1088019364382511205> and send the receipt`,
            ephemeral: true,
            components: [row],
            files: [sfattach],
          });
        }

        if (plan === 'permanent') {
          const payload = Payload.setPixKey(
            '585cb0a1-7d5d-4ac8-bb61-a9f906e4fb24'
          )
            .setDescription('Free Fire - Permanent')
            .setMerchantName('SOFT.CC')
            .setMerchantCity('PARANA')
            .setAmount('249.99')
            .setTxid('***')
            .setUniquePayment(true);

          const data = await payload.getData();

          const sfbuff = new Buffer.from(
            data.qrcode_payload.split(',')[1],
            'base64'
          );
          const sfattach = new AttachmentBuilder(sfbuff, 'output.png');

          copyandpaste = data.text_payload;
          let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('sendPixCopyPaste')
              .setLabel('COPY AND PASTE')
              .setStyle(ButtonStyle.Primary)
          );

          await interaction.deferUpdate();
          await interaction.editReply({
            content: `Please complete your payment:\nType: Free Fire - Permanent\n\nAfter making the payment, open a <#1088019364382511205> and send the receipt`,
            ephemeral: true,
            components: [row],
            files: [sfattach],
          });
        }
      }
    }
  }

  if (interaction.customId === 'sendPixCopyPaste') {
    if (interaction.isButton()) {
      interaction.reply({ content: copyandpaste, ephemeral: true });
    }
  }
}

module.exports = { freefire };
