
const net = require('net')
const readLine = require('readline')

const client = new net.Socket()

const inputs = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})


const connectionCallback = () => {   

    console.log("Digite sua operaçao no padrão <numero> <numero> <operação> sem virgula.")
    inputs.addListener('line', line => {
        client.write(`${line}`)
    })

}

client.connect(4242, '127.0.0.1',connectionCallback);


client.on("data", (data) => {
    console.log(data.toString())
})