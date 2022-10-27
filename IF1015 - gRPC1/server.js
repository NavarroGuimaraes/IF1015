const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("calculator.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const calculatorPackage = grpcObject.calculatorPackage

const server = new grpc.Server();
server.addService(calculatorPackage.CalculatorService.service,
    {
        "doTheMath": doTheMath
    });

server.bind("127.0.0.1:4242", grpc.ServerCredentials.createInsecure());
console.log("🚀 Now you can connect here!");
server.start();

const doCalculate = {
    1: (num1, num2) => {return num1 + num2},
    2: (num1, num2) => {return num1 - num2},
    3: (num1, num2) => {return num1 * num2},
    4: (num1, num2) => {return num1 / num2} 
}

function doTheMath(call, callback) {

    const operation = call.request.operation;
    const num1 = call.request.num1;
    const num2 = call.request.num2;

    const result = doCalculate[operation](parseFloat(num1), parseFloat(num2));

    console.log(operation);
    console.log(num1);
    console.log(num2);
    console.log(result);

    callback(null, {"result": result})   
}