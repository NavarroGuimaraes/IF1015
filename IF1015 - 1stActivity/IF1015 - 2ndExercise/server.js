// *********** SEGUNDA ATIVIDADE *********** 
const net = require('net')
const readLine = require('readline')

const inputs = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

const connectedClients = []

const sendMessages = (senderPort, message) => {

    const clientsToSendMessage = connectedClients.filter(socket => socket.remotePort != senderPort);
    clientsToSendMessage.forEach(
        socket => socket.write(message)
    );

}

const handleConnection = socket => {

    socket.on('data', data => {
        
        const str = data.toString();
        if (str.toLowerCase() == 'end') { //apenas a comparação deve ser em lower case para exibir a mensagem conforme foi digitada
            socket.write("você foi desconectado. Pressione CTRL + C para sair do cliente.");
            socket.end();
        }

        console.log(str);
        sendMessages(socket.remotePort, str);
        
    })

}

const server = net.createServer(handleConnection)
server.listen(4242, '127.0.0.1')

server.on('connection', (socket) => {

    socket.write("Olá, bem vinto ao chat na borda do espaço tempo. Aqui, nada tem passado, presente ou futuro.")
    
    connectedClients.push(socket);
    
    inputs.addListener('line', line => {
        socket.write(line)
    })

})
