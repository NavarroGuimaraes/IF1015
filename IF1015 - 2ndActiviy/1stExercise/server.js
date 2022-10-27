const udp = require('dgram');
const server = udp.createSocket('udp4');

const possibleListeners = [];

const removeListener = (port) => {
    const index = possibleListeners.indexOf(port);
    if (index > -1) {
        console.log(`Porta ${port} removida dos possíveis ouvintes`)
        possibleListeners.splice(index, 1);
    }
}

const sendMessage = (message, port) => {

    server.send(message, port, 'localhost' ,(error) => {

        if(error) {

            console.log(`não foi possível a enviar mensagem para a porta ${port} :( \n`);
            console.error(error);
            // Se rolou erro, vamos remover o listener até a prõxima mensagem do mesmo para evitar spammar erro no console
            removeListener(port);

        }

    })
};

const handleReceivedMessage = (message, port) => {
    const filteredListeners = possibleListeners.filter(listenerPort => listenerPort != port);
    
    filteredListeners.forEach(listenerPort => {
        sendMessage(message, listenerPort);
    });
    
    if ( ! possibleListeners.includes(port) ){
        console.log(`Porta ${port} adicionada aos possíveis ouvintes`)
        possibleListeners.push(port)
    }
        
}

// emitido quando algum erro ocorre
server.on('error',(error) => {
    console.log('Houve o seguinte erro: ' + error);
});



// Emitido quando recebe mensagem
server.on('message',(msg,info) => {
    console.log(`${msg}`);
    console.log(`Nesta mensagem foram recebidos ${msg.length} bytes enviados de ${info.address}:${info.port}\n`);
    handleReceivedMessage(msg, info.port);

});

// Função para lidar com o serviddor ao receber um novo dado
server.on('listening',() => {
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log(`O servidor está ouvindo na porta: ${port}`);
  console.log(`IP :${ipaddr}`);
  console.log(`Server is IP4/IP6 : ${family}`);
});

// emitido após o servidor fechar
server.on('close',() => {
  console.log('Servidor fechado');
});

server.bind(8042);