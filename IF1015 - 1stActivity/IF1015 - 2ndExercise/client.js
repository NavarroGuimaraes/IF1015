// *********** SEGUNDA ATIVIDADE ***********
const net = require('net')
const readLine = require('readline')

const client = new net.Socket()


let username = "";

const connectionCallback = () => {

    const inputs = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    })    

    inputs.addListener('line', line => {
        client.write(`${username}: ${line}`)
    })
    client.write(`Nova conexão de ${username}`)

}

function askName(question){

    const inputs = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    inputs.setPrompt(question);
    inputs.prompt();

    inputs.on('line', (userInput) => {
        username = userInput.toString();
        inputs.close();
    });

    inputs.on('close', () => {
        console.log(`Muito prazer ${username}`);
        client.connect(4242, '127.0.0.1',connectionCallback)
    });

}

client.on("data", (data) => {
    console.log(data.toString())
})

askName("Antes de começarmos, nos diga seu nome: ")