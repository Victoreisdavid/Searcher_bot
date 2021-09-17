/*
	O parâmetro 1 deve ser o ID do servidor, enquanto o 2 deve ser o nome do comando que você quer remover.
*/

let guildID = process.argv[2]
let commandName;
if(!isNaN(guildID)) {
 commandName = process.argv[3]
} else {
 commandName = process.argv[2]
 guildID = undefined
}

console.log(guildID, commandName)

require("./src/utils/registers/deleteCommand")(guildID, commandName)