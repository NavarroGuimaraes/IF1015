// *********** PRIMEIRA ATIVIDADE ***********
const net = require('net')
const readLine = require('readline')

const client = new net.Socket()

const inputs = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

const connectionCallback = () => {
    console.log('conectado.')
    inputs.addListener('line', line => {
        client.write(line)
    })
    client.write('Me conectei mwahaha')
}

client.connect(4242, '127.0.0.1',connectionCallback)

client.on("data", (data) => {
    console.log(`Mensagem recebida do servidor: ${data}`)
})