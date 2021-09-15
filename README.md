# 🔎 Searcher
Faça pesquisas dentro do discord.

# 🤔 Como adicionar?
Você pode adicionar a versão oficial do **Searcher** [clicando aqui](https://discord.com/api/oauth2/authorize?client_id=886046032616624138&permissions=277092879424&scope=bot%20applications.commands), e lembre-se, o Searcher **nunca irá pedir permissões para modificar o seu servidor, gerenciar membros ou mensagens.**

# Caraterísticas
## 1. Facilidade de usar
O Searcher é **fácil de usar**, com sistemas relativamente simples, pensados principalmente para facilidade de uso para o usuário final.
## 2. Seguro e estável
A equipe de desenvolvimento do Searcher **prioriza ao máximo a segurança para os servidores**, estamos direto analisando possibilidades de bloquear a exibição de conteúdos NSFW (pornografia, gore, etc.), fazer o Searcher exibir conteúdos NSFW é realmente uma missão difícil e cansativa.
## 3. Código Aberto
O código do Searcher é **aberto**, qualquer um pode contribuir com o projeto abrindo pull requests,issues para reportar bugs, etc.

# Área dos programadores
Se interessou pelo código? Achou algum erro, quer fazer uma versão auto-hospedada (famoso fork/clone), ou simplesmente achou uma forma de deixar o código melhor? Aqui é a sua área!
## 🚀 Selfhosting
Caso você queira fazer uma versão auto-hospedada, precisa saber algumas coisas antes.

### Respeite a licença e os desenvolvedores do projeto
Ao clonar esse código, você **deve seguir a licença** `GPLv3`. Destacando duas coisas que você deve seguir (a licença exige mais coisa, para mais detalhes, leia o arquivo `LICENSE`):
- Você deve deixar as alterações no código públicas.
- Você deve dar os créditos aos criadores, por favor não fale que você quem criou.

### Instalando dependências.
Depois de clonar esse repositório, execute o comando
```
npm install
```
isso irá instalar todas as dependências que estão no `package.json`.
### Definindo váriaveis de ambiente
No repositório, existe um arquivo chamado *".env.example"*, é um exemplo de como você deve criar seu arquivo *".env"*, que por motivos de segurança, não é deixado público junto com o código (pull requests que enviarem arquivos que não podem ficar públicos serão rejeitados).
### Preparando o config.yaml
Dentro do **config.yaml** estão algumas coisas importantes para o funcionamento do bot.
```bash
bot:
 public_key: "40cb884282ec0be554b591ff7304155f5b200e4a85d624f03486bb94f9a821ce"
 id: "886046032616624138"
 devs: 
  - "Shut!#5230"
  - "Weariful#6650"
 dev_ids:
  - "470976775145390082"
  - "343778106340802580"
 logs:
  channel:
   id: "886398255540367412"
```
esse é o config.yaml do Searcher, como você pode ver, é bem pequeno e simples.
Veja uma versão explicando cada propriedade:
```bash
bot: #configurações do bot
 public_key: "" #chave pública do seu bot
 id: "" #ID do seu bot
 devs: #lista de desenvolvedores (nome e tag)
  - "" #Coloque quantos nomes quiser, porém coloque um "-" no começo cada nome
 dev_ids: #lista de desenvolvedores (id)
  - "" #Coloque quantos ID's quiser, porém coloque um "-" no começo de cada ID
 logs: #Configurações das logs
  channel: # canal das logs
   id: "" #ID do canal das logs
```
Seguindo os 2 exemplos acima, você deve montar o config.yaml do seu bot.

### Testando o seu bot
Depois de preparar as variáveis de ambiente e o config.yml, rode o seguinte comando no seu terminal:
```
node index.js
```
Caso tudo ligar normalmente, parabéns, sua instância auto-hospedada está quase pronta. Só falta agora registrar os comandos e a url de interação.

### Registrando os comandos
A forma de registrar os comandos é altamente configurável.
#### Afinal, qual é a estrutura de um comando?
Todos os comandos estão localizados em `src/commands`, cada um exporta um objeto com as suas informações, e uma função **obrigatória** para executar o comando, e outra *opcional* para gerenciar interações
##### Estrutura de um comando
nota: tudo o que terminar com "?" significa que é opcional.

Propriedade | Descrição | tipo 
----------- | --------- | ----
command | Propriedades que serão enviadas ao discord. | `Object`
command.name | Nome do comando | `String`
command.description | Descrição do comando |  `String`
command.type`?` | Tipo de comando | `Number`
command.options`?` | [Opções do comando](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) | `Array`
limitations`?` | Limitações do comando | `Object`
limitations.register`?` | Limitações aplicadas na hora de registrar o comando | `Object`
limitations.register.global`?` | Limitar o registro global do comando? (ignorar ele, resumindo), `true` = sim, `false` = não | `Boolean`
limitations.register.local`?` | Limitar o registro local do comando? (quando registra apenas em um servidor), `true` = sim, `false` = não | `Boolean`
execute | Função que executa o comando (não enviado ao discord) | `Function`
handleInteraction`?` | Função executada para responder a interações nos componentes de mensagem. | `Function`

Exemplo de um objeto de comando:
```javascript
{
    command: {
        name: "Nome do comando",
        description: "Descrição do comando",
        type: "tipo do comando",
        options: [] //Opções do comando
    },
    execute: async function(data) {
        //Nota: data é o único parâmetro passado, nele contém tudo o que o discord envia ao webserver quando um comando é usado.
        return {
            type: 4, //type de resposta 4 significa "CHANNEL_MESSAGE_WITH_SOURCE", resumindo, envia uma mensagem.
            data: { //conteúdo da resposta
                content: "Olá mundo!"
            }
        }
    }
}
```

Sabendo disso, você pode ir para o próximo tópico.

#### Registrando os comandos globalmente
Para registrar todos eles globalmente, é muito simples, rode isso no seu terminal:
```
node registerCommands.js
```
Feito isso, todos os comandos serão registrados globalmente (lembrando que leva até 1 hora pra atualizar em todos os servidores)
#### Registrando comandos localmente (apenas em um servidor)
Registrar comandos localmente também é muito simples, é quase igual a forma anterior, porém com um parâmetro adicional, o ID do servidor que o comando será registrado.
```
node registerCommands.js <id do servidor>
```
Feito isso, os comandos seráo registrados no servidor que você colocou o ID, se for válido e o bot estiver nele.
#### Registrando apenas um comando específico
As vezes registrar todos os comandos de uma vez, simplesmente porque você editou apenas um é um pouco cansativo (visto que se registrados globalmente, todos podem levar até 1 hora para atualizar em todos os servidores.), por isso também existe uma forma de registrar apenas um comando.
##### Registrando apenas um comando globalmente
Para fazer isso é simples, rode o seguinte comando:
```
node registerCommand.js <nome do arquivo do comando>
```
feito isso, o comando será registrado globalmente.
lembrando: **o nome do ARQUIVO onde está o código do comando.**
##### Registrando apenas um comando localmente
Para registrar um comando localmente, use dessa forma:
```
node registerCommand.js <ID do servidor> <nome do arquivo do comando>
```
feito isso, o comando será registrado no servidor.
#### Preparando seu bot pra receber interações no webserver
O Searcher *não usa a gateway pra receber e responder comandos*, nós somos modinhas, usamos webserver 😎👍
Antes de tudo, descubra qual a URL do seu webserver (o discord não consegue enviar solicitação para o `localhost`, então dê uma forma de expor no seu IP público, caso esteja no seu pc).
Caso você esteja em uma plataforma como o [heroku](https://heroku.com), você pode ver nas configurações onde seu servidor web pode ser encontrado.
##### Para ver a URL do seu webserver no heroku:
1. Vá na parte de configurações do seu app, localize "settings" na barra de navegação.
2. Desça até encontrar por "Domains", exemplo abaixo:

![exemplo de como ver dominio no heroku](https://cdn.discordapp.com/attachments/886736113237127188/887510069745430629/unknown.png)
Lembrando que se você estiver usando outra plataforma, pode consultar o google, ou a documentação da plataforma para ver onde descobrir a URL do seu webserver.
##### Configurando a URL de interação
Na página de configurações gerais do seu app no discord, procure por `INTERACTIONS ENDPOINT URL`, como na imagem abaixo (onde tá censurado a URL):
![imagem de exemplo](https://cdn.discordapp.com/attachments/886736113237127188/887507932340711444/unknown.png)
lá você coloca a URL do seu webserver, com o endpoint `/api/interaction`, logo depois clique em `save`. Logo após isso, o discord irá enviar algumas solicitações de testes para o seu servidor, se tudo ocorrer certo, sua versão auto-hospedada está pronta!
