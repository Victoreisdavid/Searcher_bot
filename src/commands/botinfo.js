const ms = require("pretty-ms")

module.exports = {
    command: {
        name: "botinfo",
        description: "Informações sobre mim (:",
    },
    execute: async function (data) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                embeds: [
                    {
                        title: "SearcherBot - v1",
                        description: ":wave: Olá! Eu sou o **Seacher**, apenas um bot que gosta de fazer pesquisas para as pessoas :cowboy:",
                        fields: [
                            {
                                name: "<:origin:886471923301744671> Quem são meus desenvolvedores?",
                                value: `**Fui desenvolvido por:**\n ${"`" + Config.bot.devs.join("\n") + "`"}`
                            },
                            {
                                name: ":eyes: Sabia que eu sou código aberto?",
                                value: `Você pode ver como fui programado aqui: https://github.com/Victoreisdavid/Searcher_bot`
                            },
                            {
                                name: "<:ebaa:886554070075203625> Informações minhas",
                                value: `**Servidores:** \`${bot.guilds.size}\`\n**Comandos (sem contar subcomandos):** \`${commands.size}\`\n**Tempo ligado:** \`${ms(process.uptime() * 1000)}\``
                            },
                            {
                                name: "<:desktop:886471189017534494> Informações do sistema",
                                value: `**Versão do node.JS:** \`${process.version}\`\n**Uso de memória RAM:** \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\``
                            }
                        ],
                        thumbnail: {
                            url: Config.images_server + "/searcher_thumb.png"
                        }
                    }
                ]
            }
        }
    }
}