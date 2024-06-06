module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(
      '[sucess] '.green + `${client.user.username.toLowerCase()} started.`
    );
  },
};
