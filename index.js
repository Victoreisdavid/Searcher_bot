/*
	Pra uma melhor organização, tudo o que for relacionado ao bot ficará dentro da pasta "src".
*/

const { readFileSync, promises: { readdir } } = require("fs")
const { parse } = require("yaml")
const yamlFile = readFileSync("./config.yaml", "utf8")
const colors = require("colors")
/* 
 * Declaração de variáveis globais
*/
global.colors = colors
global.Config = parse(yamlFile)
global.Constants = require("./src/utils/constants")
global.Bluebird = require("bluebird")
global.commands = new Map()
//-----

Config.images_server = process.env.IMAGES_SERVER

/* 
 * Carregando todos os comandos
*/
const files_p = readdir("./src/commands")
Bluebird.resolve(files_p).then(files => {
    for(const file of files) {
        const prop = require(`./src/commands/${file}`)
        commands.set(prop.command.name, prop)
    }
    console.log(colors.yellow("Comandos carregados:", files.length))
})
//-----

/* 
 * Iniciando todas as coisas necessárias pro Searcher funcionar bem
*/
console.log(colors.yellow("Iniciando todos os módulos."))
require("dotenv").config()
require("./src/client")
require("./src/index");