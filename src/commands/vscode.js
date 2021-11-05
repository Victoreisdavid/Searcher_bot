const stores = new Map()

module.exports = {
  command: {
    name: "vscode",
    description: "Pesquise coisas do visual studio code.",
    options: [
      {
        type: 2,
        name: "extension",
        description: "Pesquise uma extensão do visual studio code.",
        options: [
          {
            type: 1,
            name: "search",
            description: "Pesquise uma extensão do visual studio code.",
            options: [
              {
                type: 3,
                name: "query",
                description: "Pesquisa a ser feita.",
                required: true
              }
            ]
          }
        ]
      }
    ]
  },
  execute: async function(data) {
    if(data.data.options[0].options[0].name == "search") {
      return await search_extension_subcommand(data)
    }
  },
  handleInteraction: handleInteraction
}

async function search_extension_subcommand(data) {
  const query = data.data.options[0].options[0].options[0].value
  let packages = await apis.vscode.search(query)
  if(!packages || packages.length == 0) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> Não achei nenhum resultado.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const options = []
  const packages_names = []
  let muchLong_text = ""
  for(let p = 0; p < 10; p++) {
    if(!packages[p]) break;
    const name = packages[p].displayName || packages[p].extensionName 
    options.push({
      label: name.length > 30 ? name.slice(0, 30) + "..." : name,
      value: packages[p].extensionId
    })
    packages_names.push(`${p} - ${name.length > 30 ? name.slice(0, 30) + "..." : name}`)
  }
  
  const limitText = packages.length > 100 ? "Muita coisa né? Me agradeça por processar os 10 primeiros pra facilitar sua vida :handshake:" : "Estou mostrando apenas os 10 primeiros."
  const Token = bot.genToken(95)
  bot.results_store.set(Token, packages)
  const url = `https://marketplace.visualstudio.com/search?term=${encodeURIComponent(query)}&target=VSCode&category=All%20categories&sortBy=Relevance`
  const response_data = {
    data: {
      embeds: [
        {
          author: {
            name: "Searcher - VSCode",
            url: "https://code.visualstudio.com"
          },
          url: url,
          title: "Resultados da pesquisa",
          description: `:mag_right: Pesquisei por \`${query}\` nas extensões do visual studio code, e achei \`${packages.length}\` resultados. ${limitText}`,
          color: Config.bot.embeds.colors.blue,
          fields: [
            {
              name: ":mag_right: Resultados",
              value: packages_names.join("\n")
            }
          ],
          footer: {
            text: "Caso algum nome esteja cortado, é porque ele é muito grande."
          }
        }
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: Token,
              placeholder: "selecione o resultado..",
              options: options
            }
          ]
        }
      ]
    }
  }
  //Tempo que ele vai esperar pra editar a resposta (não coloque menos de 300ms, pra evitar que ele edite antes de mandar a resposta de fato.)
  setTimeout(async () => {
    const edit_result = await bot.editInteraction(data.token, response_data.data)
    if(!edit_result) {
      bot.editInteraction(data.token, {
        content: "<:warn:886469809712291850> Não foi possível exibir os resultados."
      })
    }
  }, 500)
  //-----------
  return {
    type: Constants.callback_type.UPDATE_MESSAGE_WITH_SOURCE
  }
}

async function handleInteraction(data) {
  const author = data.member ? data.member.user : data.user
  if(author.id !== data.message.interaction.user.id) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> Apenas o autor do comando pode selecionar um resultado.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const query = data.data.values[0]
  const extensions = bot.results_store.get(data.data.custom_id)
  if(!extensions) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> Eu perdi os resultados, por favor, use o comando novamente.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const extension = extensions.find(pkg => pkg.extensionId == query)
  const name = extension.displayName || extension.extensionName
  const author_name = extension.publisher.displayName || extension.publisher.extensionName
  const url = `https://marketplace.visualstudio.com/items?itemName=${name.replace(/ /g, ".")}`
  const downloads = extension.statistics.find(e => e.statisticName == "install")?.value
  let t_daily = extension.statistics.find(e => e.statisticName == "trendingdaily")?.value
  let t_week = extension.statistics.find(e => e.statisticName == "trendingweekly")?.value
  let t_month = extension.statistics.find(e => e.statisticName == "trendingmonthly")?.value
  t_daily = t_daily ? (t_daily * 100).toFixed(2) + "%" : "0.00%"
  t_month = t_month ? (t_month * 100).toFixed(2) + "%" : "0.00%"
  t_week = t_week ? (t_week * 100).toFixed(2) + "%" : "0.00%"
  return {
    type: Constants.callback_type.EDIT_MESSAGE,
    data: {
      embeds: [
        {
          author: {
            name: "Visual Studio Code extension",
            url: url,
            icon_url: Config.images_server + "/VSCODE_logo.png"
          },
          timestamp: new Date(),
          thumbnail: {
            url: Config.images_server + "/VSCODE_logo.png"
          },
          color: Config.bot.embeds.colors.blue,
          title: name,
          url: url,
          description: extension.shortDescription,
          fields: [
            {
              name: ":mag_right: Informações gerais",
              value: `**Publicado por: \`${author_name}\`\nURL da extensão: [clique aqui](${url})**`,
              inline: true
            },
            {
              name: ":open_file_folder: Estatísticas",
              value: `**Downloads: \`${downloads || "Unknown"}\`\nCrescimento hoje: \`${t_daily}\`\nCrescimento na semana: \`${t_week}\`\nCrescimento no mês: \`${t_month}\`**`,
              inline: true
            },
            {
              name: ":pushpin: Categorias",
              value: `**${extension.categories.join("\n")}**`
            }
          ]
        }
      ]
    }
  }
}