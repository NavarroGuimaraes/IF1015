const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const rl = require('readline')
let username = 'nameless user';

const questionInterface = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const SERVER_ADDRESS = '127.0.0.1';
const SERVER_PORT = 8042;

const callBackOnSendMessage = (err, bytes) => {

    if (err) console.error(err);
    console.log('Mensagem enviada');

};

const sendMessage = (message) => {
    client.send(message, 0, message.length, SERVER_PORT, SERVER_ADDRESS, callBackOnSendMessage);
};

client.on('listening', () => {

    const address = client.address();

    console.log('Cliente ouvindo na porta ' + address.port);
});

client.on('message', (message, remote) => {

    console.log(`${message}`);

});

questionInterface.question('Como é seu nome?\n', name => {
    console.log(`Prazer, ${name}!`);
    username = name;
    const message = `${name} conectou`;
    sendMessage(message);
 
});    

questionInterface.addListener('line', line => {
    const message = `${username}: ${line}`; 
    sendMessage(message);
})