const udp = require('dgram');
const server = udp.createSocket('udp4');

const validOperators = ['+', '-', '*', '/']
const doTheMath = {
    '+': (num1, num2) => {return num1 + num2},
    '-': (num1, num2) => {return num1 - num2},
    '*': (num1, num2) => {return num1 * num2},
    '/': (num1, num2) => {return num1 / num2} 
}
const isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

const isNotAValidNumber = (str) => {
    return !isNumeric(str);
}

const isNotAValidOperator = (str) => {
    return !validOperators.includes(str);
}

const sendMessage = (message, port) => {

    let data = Buffer.from(message);    

    server.send(data, port, 'localhost' ,(error) => {

        if(error) {

            console.log(`não foi possível a enviar mensagem para a porta ${port} :( \n`);
            console.error(error);

        }

    })
};

const handleOperation = (message, port) => {

    const str = message.toString();

    const arguments = str.split(/(\s+)/).filter(argument => argument.trim().length > 0);

    if (arguments.length != 3) {
        sendMessage("Tá querendo bagunçar aqui? Pase apenas 3 argumentos separados por espaço: num1 num2 operação", port);
        return;
    }

    const num1 = arguments[0];
    if (isNotAValidNumber(num1)) {
        sendMessage("O primeiro argumento da operação deve ser um número... bruh", port);
        return;
    }

    const num2 = arguments[1];
    if (isNotAValidNumber(num2)) {
        sendMessage("O segundo argumento da operação deve ser um número, isso náo é python cara.", port);
        return;
    }

    const op = arguments[2];
    if (isNotAValidOperator(op)) {
        sendMessage("Que operaçao da deep web é essa? Sõ aceito +, -, * e /. É pegar ou largar.", port);
        return;
    }

    const result = doTheMath[op](parseFloat(num1), parseFloat(num2));
    console.log(`resultado: ${result}`);
    sendMessage(`O resultado da sua operação é: ${result}`, port);
        
}

// emitido quando algum erro ocorre
server.on('error',(error) => {
    console.log('Houve o seguinte erro: ' + error);
});



// Emitido quando recebe mensagem
server.on('message',(msg,info) => {
    console.log(`Operaçao enviada pelo cliente: ${msg}`);
    handleOperation(msg, info.port);

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