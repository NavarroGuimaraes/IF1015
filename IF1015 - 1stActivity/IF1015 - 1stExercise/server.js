// *********** PRIMEIRA ATIVIDADE ***********
const net = require('net')

const readLine = require('readline')

const badWords = ['fod', 'caralho', 'arrombad']

const inputs = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

const handleConnection = socket => {

    console.log('O cliente foi conectado.')

    socket.on('data', data => {
        
        const str = data.toString();
        if (str.toLowerCase() == 'end') { //apenas a comparação deve ser em lower case para exibir a mensagem conforme foi digitada
            socket.write("você foi desconectado. Pressione CTRL + C para sair do cliente.")
            socket.end()
        }
        if (badWords.some(badWord => str.toLowerCase().includes(badWord))) { 
            socket.write("Que linguagem baixa em, você será desconectado. Pressione CTRL + C para sair do cliente.")
            socket.end()
        }
        console.log(`Mensagem recebida do Cliente: ${str}`)

    })

}

const server = net.createServer(handleConnection)
server.listen(4242, '127.0.0.1')

server.on('connection', (client) => {
    
    client.write("Oi Cliente! Bem vindo ao servidor. Mas nao te servirei dor, pode ficar tranquilo.")
    
    inputs.addListener('line', line => {
        client.write(line)
    })

})


