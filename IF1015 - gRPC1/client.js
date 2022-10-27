const readLine = require("readline");
const rl = readLine.createInterface({ input: process.stdin, output: process.stdout })

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("calculator.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const calculatorPackage = grpcObject.calculatorPackage

const client = new calculatorPackage.CalculatorService("127.0.0.1:4242",
    grpc.credentials.createInsecure());

const operationsEquivalent = {
    '+': 1,
    '-': 2,
    '*': 3,
    '/': 4 
}

console.log("E aí danado. Olha eu aqui de novo dessa vez implementada em gRPC!!");
console.log("As operaçoes que tenho disponiveis ainda são as mesmas: +, -, *, /");
console.log("Sendo essas as requisições, respectivamente, de soma, subtração, multiplicação e divisão.");
console.log("Um pequeno exemplo: Para somarmos 3+3 mandamos: 3,3,+ (O HEXA TÁ VINDO)");

rl.addListener('line', message => {

    let params = message.split(",");
    let operation = convertOperation(params[2]);
    if (!operation) {
        console.log("Que operaçao da deep web é essa? Sõ aceito +, -, * e /. É pegar ou largar.")
        return;
    }
    let num1 = parseFloat(params[0]);
    let num2 = parseFloat(params[1]);
    
    client.doTheMath({
        "num1": num1,
        "num2": num2,
        "operation": operation
    }, (err, response) => {
        console.log("O resultado é: " + JSON.stringify(parseFloat(response.result)))
    })
})


const convertOperation = (requestedOperation) => {
    return operationsEquivalent[requestedOperation];
}