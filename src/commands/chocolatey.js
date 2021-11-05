const { DateTime } = require("luxon")
const { readFileSync } = require("fs")
function getNumbers(string) {
  return Number(string.replace(/[^0-9]/g, ""))
}

module.exports = {
  command: {
    name: "chocolatey",
    description: "Faça pesquisas dentro do chocolatey.",
    options: [
      {
        type: 2,
        name: "package",
        description: "Pacotes disponíveis no chocolatey.",
        options: [
          {
            type: 1,
            name: "search",
            description: "Pesquisa os pacotes no chocolatey.",
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
      },
      {
        type: 1,
        name: "about",
        description: "O que é o chocolatey?"
      }
    ]
  },
  execute: async function execute(data) {
    if(data.data.options[0].options && data.data.options[0].options[0].name == "search") {
      return await search_subcommand(data)
    } else if(data.data.options[0].name == "about") {
      return await about_subcommand(data)
    }
  },
  handleInteraction: handleInteraction
}

async function search_subcommand(data) {
  const query = data.data.options[0].options[0].options[0].value
  const packages = await apis.chocolatey.search(query)
  if(!packages || packages.length == 0) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> não achei nenhum resultado!",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const packages_names = packages.map((pkg, i) => i + " - " + pkg.Title)
  const options = []
  packages.forEach(pkg => {
    options.push({
      label: pkg.Title.length > 100 ? pkg.Title.substring(0, 97) + '...' : pkg.Title,
      value: pkg.Id
    })
  })
  const Token = bot.genToken(95)
  bot.results_store.set(Token, packages)
  const url = `https://community.chocolatey.org/packages?q=${encodeURIComponent(query)}`
  return {
    type: Constants.callback_type.MESSAGE,
    data: {
      embeds: [
        {
          author: {
            name: "Searcher - chocolatey.org",
            url: "https://chocolatey.org/",
            icon_url: Config.images_server + "/Chocolatey_icon.png"
          },
          url: url,
          title: 'Resultados da pesquisa',
          color: Config.bot.embeds.colors.blue,
          description: `Pesquisei por \`${query}\` no chocolatey, veja os resultados.`,
          fields: [
            {
              name: ":mag_right: Resultados da pesquisa",
              value: packages_names.join("\n")
            }
          ],
          thumbnail: {
            url: Config.images_server + "/Chocolatey_icon.png"
          },
        }
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: Token,
              placeholder: "Selecione o resultado",
              options: options
            }
          ]
        }
      ]
    }
  }
}

async function about_subcommand(data) {
  return {
    type: Constants.callback_type.MESSAGE,
    data: {
      embeds: [
        {
          title: "Chocolatey - oque é?",
          description: `Chocolatey é um gerenciador de pacotes para Windows, muito parecido com o \`apt\` e \`yum\` do linux.`,
          color: Config.bot.embeds.colors.blue,
          fields: [
            {
              name: "<:shit:887428144469000252> Por que uma coisa dessa seria útil no windows??",
              value: `Pra quem quer só instalar coisas, clicar em botões pode ser mais fácil mesmo (maneira padrão de automatizar isso no windows, kk), porém para automizar processos e tarefas, é díficil ficar clicando em botões.`
            },
            {
              name: "<:noo:886468596363059260> Como que usa isso?",
              value: `Para instalar o chocolatey, pode ver o guia oficial [clicando aqui](https://chocolatey.org/install).\nPra instalar pacotes (ou programas) é só você rodar: \`\`\`choco install "nome do pacote"\`\`\`\nExemplo: \`\`\`choco install vscode\`\`\``
            }
          ],
          thumbnail: {
            url: Config.images_server + "/Chocolatey_icon.png"
          },
          footer: {
            text: "Para mais informações acesse: https://chocolatey.org/"
          }
        }
      ]
    }
  }
}

async function handleInteraction(data) {
  const author = data.member ? data.member.user : data.user
  if (author.id !== data.message.interaction.user.id) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> Apenas o autor do comando pode selecionar um resultado.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const query = data.data.values[0]
  const packages = bot.results_store.get(data.data.custom_id)
  if(!packages) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:warn:886469809712291850> Eu perdi os resultados, por favor, use o comando novamente.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  const package = packages.find(pkg => pkg.Id == query)
  const published = new Date(getNumbers(package.Published))
  const created = new Date(getNumbers(package.Created))
  const published_date = DateTime.fromJSDate(published, { setZone: true, setLocale: true })
  const created_date = DateTime.fromJSDate(created, { setZone: true, setLocale: true })
  const published_parsed = published_date.setZone("America/Sao_Paulo").setLocale("pt-br").toLocaleString({ year: "numeric", month: 'long', day: 'numeric' })
  const created_parsed = published_date.setZone("America/Sao_Paulo").setLocale("pt-br").toLocaleString({ year: "numeric", month: 'long', day: 'numeric' })
  const fields = [
    {
      name: ":mag_right: Informações gerais",
      value: `**Publicado por:** ${package.Authors}\n**Documentação:** ${package.DocsUrl ? `[Clique aqui](${package.DocsUrl})` : `\`Não tem.\``}\n**Código fonte:** ${package.PackageSourceUrl ? `[Clique aqui](${package.PackageSourceUrl})` : `\`Não disponível.\``}`,
      inline: true
    },
    {
      name: "<:origin:886471923301744671> Estatísticas",
      value: `**Número total de downloads:** \`${package.DownloadCount}\`\n**URL da licença:** ${package.LicenseUrl || `\`Não tem.\``}\n**Criado em:** \`${created_parsed}\`\n**Publicado em:** \`${published_parsed}\``,
      inline: true
    }
  ]
  if(package.BugTrackerUrl) {
    fields.push({
      name: '<:ebaa:886554070075203625> Seria legal você ajudar',
      value: `Caso você ache um problema em **${package.Title}**, considere abrir uma issue em: ${package.BugTrackerUrl}`
    })
  }
  return {
    type: Constants.callback_type.EDIT_MESSAGE,
    data: {
      embeds: [
        {
          title: `${package.Title} - v${package.Version}`,
          color: Config.bot.embeds.colors.blue,
          url: package.ProjectUrl || `https://community.chocolatey.org/packages/${package.Title}`,
          description: package.Summary || 'Sem descrição <:noo:886468596363059260>',
          fields,
          timestamp: new Date(),
          thumbnail: {
            url: package.IconUrl
          },
          author: {
            name: 'Chocolatey Package',
            url: 'https://chocolatey.org',
            icon_url: Config.images_server + '/Chocolatey_icon.png'
          }
        }
      ]
    }
  }
}