const {
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

const paypal = require('paypal-rest-sdk');
require('dotenv');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

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
      return_url: `https://example.com/success?userId=${user}`,
      cancel_url: 'https://example.com/cancel',
    },
  };
  return payment;
}

const ff = require('../database/models/freefire');

async function buy(interaction, client) {
  if (interaction.customId === 'paypal' || interaction.customId === 'pix') {
    const findUser = await ff.findById(interaction.user.id);
    if (findUser)
      return interaction.reply({
        content:
          "We appreciate you as a current customer! If you're interested in switching plans, please wait until your current plan has ended before making any changes. We're here to help you with any questions or concerns you may have during this process.",
        ephemeral: true,
      });
  }

  if (interaction.customId === 'paypal') {
    if (interaction.isButton()) {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('paypal')
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
        content: 'Please select an option:',
        components: [row],
        ephemeral: true,
      });
    }

    if (interaction.isStringSelectMenu()) {
      const selected = interaction.values[0];

      if (selected === '1month') {
        await interaction.deleteReply();

        paypal.payment.create(
          pay('49.99', 'Subscription for 1 month', interaction.user.id),
          async function (error, payment) {
            if (error) {
              console.log(error);
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                  await interaction.reply({
                    content: `Please complete your payment here: ${payment.links[i].href}`,
                    ephemeral: true,
                  });
                }
              }
            }
          }
        );
      }

      if (selected === '3months') {
        paypal.payment.create(
          pay('124.99', 'Subscription for 3 months', interaction.user.id),
          async function (error, payment) {
            if (error) {
              console.log(error);
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                  await interaction.reply({
                    content: `Please complete your payment here: ${payment.links[i].href}`,
                    ephemeral: true,
                  });
                }
              }
            }
          }
        );
      }

      if (selected === 'permanent') {
        paypal.payment.create(
          pay('244.99', 'Subscription Permanent', interaction.user.id),
          async function (error, payment) {
            if (error) {
              console.log(error);
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                  await interaction.reply({
                    content: `Please complete your payment here: ${payment.links[i].href}`,
                    ephemeral: true,
                  });
                }
              }
            }
          }
        );
      }
    }
  }
}

module.exports = { buy };
