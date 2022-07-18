const net = require('net')

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

const handleConnection = socket => {

    socket.on('data', data => {

        
        const str = data.toString();

        console.log(`Mensagem recebida do Cliente: ${str}`)

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
        socket.write(`o resultado da sua operação é: ${result}`)


    })

}

const server = net.createServer(handleConnection)
server.listen(4242, '127.0.0.1')

server.on('connection', (client) => {
    
    client.write("Olá! Bem vindo ao super calculador mixuruca. Eu faço de forma complicada o que seu celular já faz.");

})


