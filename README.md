<img src="https://Searcherbot.reapper.repl.co/cdn/searcher_logo.png" alt="searcher_logo" width="80%"/>

# Searcher
Faça pesquisas dentro do [Discord](https://discord.com) de forma simples e interativa.

## Como adicionar?
Você pode adicionar a versão oficial do Searcher [cliquando aqui!](https://discord.com/api/oauth2/authorize?client_id=886046032616624138&permissions=277092879424&scope=bot%20applications.commands)
### Aviso sério
O searcher nunca irá pedir permissões para mudar algo no seu servidor, ou coletar informações além de:
- ID dos usuários que utilizaram algum comando

Sempre verifique o ID da aplicação caso entre em um link postado fora desse repositório ou fora do [website oficial do Searcher](https://searcherbot.vercel.app).
Lembrando que o ID do Searcher é `886046032616624138`.

## Características
- Fácil de usar
- Seguro
- Gratuito

# Suporte 
Existem duas formas de obter suporte sobre o Searcher, sendo elas:
- Abrindo uma issue nesse repositório.
- Entrando no [servidor de suporte](https://discord.gg/fyVcBpfJpF)

# Área dos programadores
Está interessado em contribuir com o projeto? melhorar o código, ou simplesmente fazer uma versão auto-hospedada? aqui é a sua área.
## Self-hosting
Antes de fazer uma versão auto-hospedada, considere algumas coisas:
- O Searcher está em desenvolvimento, novas coisas serão feitas, e nem sempre o guia de self-hosting estará 100% atualizado (porém não vamos deixar ele aqui penando, lógico que ele irá ser atualizado também.)
- Respeite os desenvolvedores do projeto, dê os créditos e não fale que você quem fez.
- Também siga todas as exigências da licença "GPLv3".
- Você deve ter um servidor `MONGODB` para se conectar.

### Preparando o config.yml e as variáveis de ambiente
O Searcher possuí algumas informações importantes guardadas no `config.yml`, por isso você deve preparar ele de forma correta (caso contrário sua versão auto-hospedada irá rodar com diversos bugs)
Veja uma versão dele explicando as propriedades:
```
images_server: "" # URL da CDN de imagens do searcher, no caso ela rodará junto com o bot, então é o seu IP/dominio.
bot: 
 public_key: "" #Chave pública do seu bot, você deve obter ela no developers portal do discord.
 id: "" # ID da sua aplicação.
 devs: 
  - "Shut!#5230"
  - "Weariful#6650" # Aqui é a lista de desenvoledores (nome e tag), coloque eles com um "-" no começo.
 dev_ids:
  - "470976775145390082"
  - "343778106340802580" # Aqui é a lista de desenvolvedores (ID), coloque eles com um "-" no começo.
 logs:
  channel:
   id: "" #Esse é o ID do canal de logs do Searcher.
```
Prepare o seu `config.yml` com base nas informações acima.
Agora as variáveis de ambiente, você deve criar um arquivo chamado `.env`, e colocar nele as seguintes informações:
```
BOT_TOKEN=token da sua aplicação
DB_URL=URL do seu banco de dados MONGODB
DEEPAI_KEY=token de acesso do deepai
```
Para obter o token de acesso ao deepai, você deve criar uma conta em [deepai.org](https://deepai.org)
### Instalando depedências e ligando o bot
Antes, você deve instalar as dependências usando o comando:
```
npm install
```
Isso irá instalar todas as dependências que estão no `package.json`.
Após isso, você pode rodar o seguinte comando:
```
node index.js
```
Caso tudo ligar, parabéns, você concluiu boa parte do trabalho, agora falta algumas coisinhas
### Registrando os comandos
Agora você deve registrar os comandos, essa parte é relativamente simples.
Para registrar todos os comandos globalmente, é só rodar o seguinte comando:
```
node registerCommands.js
```
Nota: Os comandos globais demoram até 1 hora para atualizar em todos os servidores.
Porém, se você fizer alterações nas informações do comando (só há necessidade de atualizar caso você mudar algo dentro da propriedade `command`), você pode registrar em um servidor primeiro para não precisar esperar 1 hora.
Para registrar comandos localmente, é só rodar o comando:
```
node registerCommands.js <ID do servidor>
```
#### Registrando apenas um comando
As vezes editar todos os comandos simplesmente porque você mudou um só é meio desnecessário.
Felizmente o Searcher possui um sistema pra evitar isso.
Para registrar um comando globalmente, é só você usar:
```
node registerCommand.js <nome do arquivo do comando>
````
Para registrar um comando em apenas um servidor, é só você usar:
```
node registerCommand.js <nome do arquivo do comando> <ID do servidor>
```
**Lembrando: É o `NOME do arquivo do comando`, e não o nome do comando.**
### Registrando seu webserver
O Searcher não **utiliza gateway** para receber e responder comandos, nós somos modinhas, usamos webserver.
Para registrar seu webserver é bem simples, quando você rodar ele, veja qual a URL/IP (lembrando que se você rodar no seu PC, você deve expor o webserver no seu IP público, já que o discord não pode enviar solicitações para o IP local.), o endpoint dos comandos é `/api/interaction`.
Então a url seria: `<seu ip ou dominio>/api/interaction`
#### Configurando sua URL no developer portal
Vá nas configurações da sua aplicação no discord developer portal, logo na página de informações gerais, lá em baixo existe uma opção chamada `INTERACTIONS ENDPOINT URL`, você deve colocar a url do seu webserver lá.
Exemplo abaixo:
![Exemplo de URL de interação](https://Searcherbot.reapper.repl.co/cdn/interaction_url_example.jpg)
Depois disso, sua instância auto-hospedadas está pronta
lembrando que:
- Você precisa ter um servidor MONGODB para salvar alguns dados.
- Você precisa criar uma conta no deepai, para obter uma chave de api, já que o searcher vai usar o deepai pra analisar imagens.
- Não vamos dar suporte para versões auto-hospedadas.