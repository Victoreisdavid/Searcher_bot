module.exports = {
  command: {
    name: "help",
    description: "Aquela ajudinha com o Searcher, rs."
  },
  execute: async function (data) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        embeds: [
          {
            title: "SearcherBot",
            description: "Bem vindo ao menu de ajuda do Searcher, aqui está alguns tópicos que podem te ajudar:",
            fields: [
              {
                name: "<:noo:886468596363059260> Onde vê os comandos???",
                value: `https://searcherbot.vercel.app/commands`
              },
              {
                name: "<:pepe_gun:886468234444955738> Achei um bug!1!1!",
                value: `Calma, calma, não precisa matar o Searcher por isso!! ninguém é perfeito, caso você ache um bug, abra uma issue nesse link: https://github.com/Victoreisdavid/Searcher_bot/issues \n Ou simplesmente avisa no servidor de suporte :thumbsup:`
              },
              {
                name: "<:origin:886471923301744671> E o servidor?",
                value: `Está aqui: https://discord.gg/fyVcBpfJpF`
              }
            ]
          }
        ]
      }
    }
  }
}