module.exports = {
    command: {
        name: "guild",
        description: "Pesquise coisas do servidor.",
        options: [
            {
                type: 2,
                name: "members",
                description: "Pesquise membros no servidor.",
                options: [
                    {
                        type: 1,
                        name: "search",
                        description: "Pesquise membros no servidor.",
                        options: [
                            {
                                type: 3,
                                name: "query",
                                description: "Pesquisa a ser feita",
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
        if (subcommand == "search") {
            return await search_user_subcommand(data)
        }
    },
    handleInteraction: handleInteraction
}

async function search_user_subcommand(data) {
    const query = data.data.options[0].options[0].options[0].value
    if(query.length > 100) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                content: `<:warn:886469809712291850> O tamanho mínimo do texto de pesquisa é 100 caracteres, você digitou \`${query.length}\`.`,
                flags: Constants.message_flags.EPHEMERAL
            }
        }
    }
    const results = await apis.discord.search_member(data.guild_id, query)
    if(!results || results.length == 0) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                content: "<:warn:886469809712291850> não achei nenhum resultado!",
                flags: Constants.message_flags.EPHEMERAL
            }
        }
    }
    const options = []
    const results_parsed = results.map((result, i) => {
        const name = result.nick || result.user.username
        const discriminator = "#" + result.user.discriminator
        options.push({
            label: name > 100 ? name.substring(0, 96) + discriminator + ' ...' : name + discriminator,
            value: result.user.id
        })
        return `${i} - ${name + discriminator}`
    })
    return {
        type: Constants.callback_type.MESSAGE,
        data: {
            embeds: [
                {
                    title: `Searcher - pesquisa de membros`,
                    description: `:mag_right: Achei ${results_parsed.length} membros que o nome corresponde com \`${query}\`.`,
                    fields: [
                        {
                            name: ":mag_right: Resultados",
                            value: results_parsed.join("\n")
                        }
                    ],
                    thumbnail: {
                        url: Config.images_server + "/searcher_logo.png"
                    },
                    color: Config.bot.embeds.colors.blue
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "guild_members_box",
                            placeholder: "Selecione o membro",
                            options: options
                        }
                    ]
                }
            ]
        }
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
    const ID = data.data.values[0]
    const user = await apis.discord.get_guild_member(data.guild_id, ID)
    return {
        type: Constants.callback_type.EDIT_MESSAGE,
        data: {
            embeds: [
                {
                    title: user.user.username,
                    fields: [
                        {
                            name: "<:desktop:886471189017534494> Informações do usuário",
                            value: `**ID:** \`${user.user.id}\``
                        },
                        {
                            name: "<:origin:886471923301744671> Informações no servidor",
                            value: `**Cargos:** \`${user.roles.length}\`\n**Nickname:** \`${user.nick || user.user.username}\``
                        }
                    ],
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}`
                    },
                    timestamp: new Date()
                }
            ]
        }
    }
}