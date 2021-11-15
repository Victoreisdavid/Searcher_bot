module.exports = {
    command: {
        name: "modrinth",
        description: "Faça pesquisas no modrinth.",
        options: [
            {
                type: 2,
                name: "mod",
                description: "Pesquise um mod de minecraft no modrinth.",
                options: [
                    {
                        type: 1,
                        name: "search",
                        description: "Pesquise um mod de minecraft no modrinth.",
                        options: [
                            {
                                type: 3,
                                name: "query",
                                description: "Pesquisa a ser feita.",
                                required: true
                            },
                            {
                                type: 3,
                                name: "sortby",
                                description: "Ordem dos resultados. Tipos disponíveis: relevance, downloads, follows, newest, updated"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    execute: async function(data) {
        if (data.data.options[0].options[0].name == "search") {
            return await search_mod_subcommand(data)
        }
    },
    handleInteraction: handleInteraction
}

async function search_mod_subcommand(data) {
    const validSorts = ["relevance", "downloads", "follows", "newest", "updated"]
    const query = data.data.options[0].options[0].options[0].value
    let sortBy = data.data.options[0].options[0].options[1] ? data.data.options[0].options[0].options[1].value : null
    if(!sortBy) sortBy = "relevance";
    if(!validSorts.includes(sortBy.toLowerCase())) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                content: "<:warn:886469809712291850> Você colocou um valor inválido na organização de resultados (sortBy), os valores suportados são: \`relevance, downloads, follows, newest, updated\`",
                flags: Constants.message_flags.EPHEMERAL
            }
        }
    }
    const search = await apis.modrinth.search_mod(query, sortBy)
    if(search.hits.length == 0) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                content: "<:warn:886469809712291850> não achei nenhum resultado!",
                flags: Constants.message_flags.EPHEMERAL
            }
        }
    }
    const Token = bot.genToken(95)
    bot.results_store.set(Token, search)
    const options = []
    const results = search.hits.map((mod, i) => {
        options.push({
            label: mod.title,
            value: mod.title
        })
        return `${i} - ${mod.title}`
    })
    const url = `https://modrinth.com/mods?q=${encodeURIComponent(query)}`
    return {
        type: Constants.callback_type.MESSAGE,
        data: {
            embeds: [
                {
                    author: {
                        name: "Modrinth Minecraft Mods",
                        url: "https://modrinth.com/mods",
                        icon_url: Config.images_server + '/modrinth_logo.png'
                    },
                    url: url,
                    title: "Resultados da pesquisa",
                    description: `Pesquisei por \`${query}\` no modrinth e achei \`${results.length}\` resultados.`,
                    fields: [
                        {
                            name: ":mag_right: Resultados",
                            value: results.join("\n")
                        }
                    ],
                    thumbnail: {
                        url: Config.images_server + "/modrinth_logo.png"
                    },
                    color: 2067276
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
    const mods = bot.results_store.get(data.data.custom_id)
    if(!mods) {
        return {
            type: Constants.callback_type.MESSAGE,
            data: {
                content: "<:warn:886469809712291850> Eu perdi os resultados, por favor, use o comando novamente.",
                flags: Constants.message_flags.EPHEMERAL
            }
        }
    }
    const mod = mods.hits.find(mod => mod.title == query)
    const sides = []
    const translates = {
        server: {
            required: ":computer: Lado do servidor",
            optional: ":computer: Lado do servidor (Opcional)"
        },
        client: {
            required: ":bust_in_silhouette: Lado do jogador",
            optional: ":bust_in_silhouette: Lado do jogador (Opcional)"
        }
    }
    if(mod.server_side !== "unsupported") {
        sides.push(translates.server[mod.server_side])
    }
    if(mod.client_side !== "unsupported") {
        sides.push(translates.client[mod.client_side])
    }
    return {
        type: Constants.callback_type.EDIT_MESSAGE,
        data: {
            embeds: [
                {
                    author: {
                        name: 'Modrinth minecraft mod',
                        url: 'https://modrinth.com/mod/' + mod.slug,
                        icon_url: Config.images_server + '/modrinth_logo.png'
                    },
                    title: mod.title,
                    description: mod.description,
                    fields: [
                        {
                            name: ":mag_right: Informações gerais",
                            value: `**Autor:** \`${mod.author}\`\n**Downloads:** \`${mod.downloads}\``,
                            inline: true
                        },
                        {
                            name: ":pushpin: Categorias",
                            value: mod.categories.join("\n"),
                            inline: true
                        },
                        {
                            name: `:open_file_folder: Versões suportadas`,
                            value: mod.versions.join("\n")
                        },
                        {
                            name: ":wrench: Em qual lado pode rodar",
                            value: sides.join("\n")
                        }
                    ],
                    thumbnail: {
                        url: mod.icon_url || Config.images_server + "/modrinth_logo.png"
                    },
                    color: 2067276
                }
            ]
        }
    }
}