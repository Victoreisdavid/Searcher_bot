
module.exports = {
  command: {
    name: "roblox",
    description: "Faça pesquisas no roblox.",
    options: [
      {
        type: 2,
        name: "user",
        description: "Pesquise um usuário no roblox.",
        options: [
          {
            type: 1,
            name: "search",
            description: "Pesquisa o usuário",
            options: [
              {
                type: 3,
                name: "query",
                description: "Nome a ser pesquisado",
                required: true
              }
            ]
          }
        ]
      }
    ]
  },
  execute: async function(data) {
    const subcommand = data.data.options[0].options[0].name
    if(subcommand == "search") {
      return await searchuser_subcommand(data)
    }
  },
  handleInteraction: async function(data) {
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
    const user = await apis.roblox.get_user(query)
    const avatar = await apis.roblox.get_user_avatar(query)
    const badges = await apis.roblox.get_user_badges(query)
    if(!user) {
      return {
        type: Constants.callback_type.MESSAGE,
        data: {
          content: "<:shit:887428144469000252> Ué, não achei nada, tenta selecionar novamente.",
          flags: Constants.message_flags.EPHEMERAL
        }
      }
    }
    return {
      type: Constants.callback_type.EDIT_MESSAGE,
      data: {
        embeds: [
          {
            title: `${user.displayName || user.name}`,
            description: `${!user.description || user.description.length == 0 ? "<:noo:886468596363059260> Esse usuário não tem descrição" : user.description}`,
            fields: [
              {
                name: ":bust_in_silhouette: Avatar",
                value: `**Tipo:** \`${avatar.playerAvatarType}\`\n**Altura:** \`${avatar.scales.height}\`\n**Largura:** \`${avatar.scales.width}\`\n**Tamanho da cabeça:** \`${avatar.scales.head}\``,
                inline: true
              },
              {
                name: ":mag_right: Diversos",
                value: `**ID:** \`${user.id}\`\n**Número de badges:** \`${badges.data.length}\``,
                inline: true
              }
            ],
            timestamp: new Date(),
            thumbnail: {
              url: Config.images_server + "/Roblox_logo.png"
            },
            color: Config.bot.embeds.colors.red
          }
        ]
      }
    }
  }
}

async function searchuser_subcommand(data) {
  const query = data.data.options[0].options[0].options[0].value
  const results = await apis.roblox.search_user(query)
  if(!results) {
    return {
      type: Constants.callback_type.MESSAGE,
      data: {
        content: "<:noo:886468596363059260> Não foi possível fazer a pesquisa, provavelmente nenhum resultado foi encontrado.",
        flags: Constants.message_flags.EPHEMERAL
      }
    }
  }
  let index = 0
  const options = []
  const names = results.data.map(u => u.displayName ? u.displayName.toLowerCase() : u.name.toLowerCase())
  const parsed_results = results.data.map((u, i) => {
    const name = `${i} - ${u.displayName || u.name}`
    options.push({
      label: name,
      value: u.id
    })
    return name
  })
  return {
    type: Constants.callback_type.MESSAGE,
    data: {
      embeds: [
        {
          title: "Searcher - roblox users",
          description: `:mag_right: Nessa pesquisa achei ${parsed_results.length} usuários.`,
          fields: [
            {
              name: ":mag_right: Resultados",
              value: parsed_results.join("\n")
            }
          ],
          thumbnail: {
            url: Config.images_server + "/Roblox_logo.png"
          },
          color: Config.bot.embeds.colors.red
        }
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: "roblox_users_box",
              placeholder: "Selecione o usuário",
              options: options
            }
          ]
        }
      ]
    }
  }
}