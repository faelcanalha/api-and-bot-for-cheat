const { freefire } = require('../interaction/freefire');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    freefire(interaction, client);
  },
};
