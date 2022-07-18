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

    server.send(message, port, 'localhost' ,(error) => {

        if(error) {

            console.log(`não foi possível a enviar mensagem para a porta ${port} :( \n`);
            console.error(error);
            // Se rolou erro, vamos remover o listener até a prõxima mensagem do mesmo para evitar spammar erro no console
            removeListener(port);

        }

    })
};

const handleOperation = (message, port) => {

    const str = message.toString();

    const arguments = str.split(/(\s+)/).filter(argument => argument.trim().length > 0);

    if (arguments.length != 3) {
        socket.write("Tá querendo bagunçar aqui? Pase apenas 3 argumentos separados por espaço: num1 num2 operação");
        return;
    }

    const num1 = arguments[0];
    if (isNotAValidNumber(num1)) {
        socket.write("O primeiro argumento da operação deve ser um número... bruh");
        return;
    }

    const num2 = arguments[1];
    if (isNotAValidNumber(num2)) {
        socket.write("O segundo argumento da operação deve ser um número, isso náo é python cara.");
        return;
    }

    const op = arguments[2];
    if (isNotAValidOperator(op)) {
        socket.write("Que operaçao da deep web é essa? Sõ aceito +, -, * e /. É pegar ou largar.");
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