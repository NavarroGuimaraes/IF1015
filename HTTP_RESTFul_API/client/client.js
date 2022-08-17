const axios = require('axios');
const config  = require('config');
const readLine = require("readline")
const questionLinereader = require('readline');

const rl = readLine.createInterface({ input: process.stdin, output: process.stdout })

const port = process.env.PORT || config.get('server.port');

const instance = axios.create({
  baseURL: `http://localhost:${port}`,
  timeout: 5000
});

const validOperations = ['1', '2', '3', '4', '5', '6']
const operations = {
    '1': () => {return findAll()},
    '2': () => {return findOne()},
    '3': () => {return createAPerson()},
    '4': () => {return updateAPerson()},
    '5': () => {return deleteAPerson()},
    '6': () => {return printOptions()}
    
}

const DEFAULT_PATH_RESOURCE = "/person";
let IS_PAUSED = false; // Sim, fiz essa gambi porque a porcaria do node não pausa o readline quando chamamos o pause()

function printOptions() {
    console.log("1 - Listar as pessoas e seus pets");
    console.log("2 - Buscar uma pessoa específica por ID");
    console.log("3 - Criar uma nova pessoa");
    console.log("4 - Atualizar uma pessoa");
    console.log("5 - Deletar uma pessoa (e seus pets coitados)");
    console.log("6 - Imprimo isso aqui tudinho de novo");
    askOperation("Qual a operação desejada?\n");
}

function isAValidOperation(str) {
    return validOperations.includes(str);
}

function askQuestion(message) {
    const questionInterface = questionLinereader.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => questionInterface.question(message, ans => {
        questionInterface.close();
        resolve(ans);
    }))
}

function askOperation(message) {
    const questionInterface = questionLinereader.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => questionInterface.question(message, ans => {
        questionInterface.close();
        resolve(ans);
        if (isAValidOperation(ans)) {
            operations[ans]();
        } else {
            console.log(`Oh mizera... onde que ${ans} está entre 1 e 6???`);
            askOperation("Vamos tentar de novo\n");
        }
        
    }))
}

async function findAll() {
    let response = await instance.get(DEFAULT_PATH_RESOURCE);
    console.log(JSON.stringify(response.data))
    askOperation("Isso foi o que encontrei\nQual a operação desejada?\nDigite 6 para rexibir as opções\n");
}

async function findOne() {
    let userInput = await askQuestion("Qual o ID desejado?\n");
    let response = await instance.get(`${DEFAULT_PATH_RESOURCE}/${userInput}`)
    console.log(JSON.stringify(response.data))
    askOperation("Isso foi o que encontrei\nQual a operação desejada?\nDigite 6 para rexibir as opções\n");
}

async function createAPerson() {

    let userName = await askQuestion("Qual o nome do usuário?\n");
    let howManyPets = await askQuestion("Quantos pets ele tem?\n");
    let index = 1
    let pets = []

    
    while (index <=parseInt(howManyPets)) {
        let petName = await askQuestion(`Qual o nome do pet numero ${index}?\n`)
        let petCategory = await askQuestion("Qual a categoria do pet? (por enquanto, esse campo é livre)\n")
        pets.push({ name: petName, category: petCategory})
        index++;
    }
    let user = {
        name: userName,
        pets
    }
    let response = await instance.post(DEFAULT_PATH_RESOURCE, user);
    console.log(JSON.stringify(response.data))

    askOperation("Ufa, criadinho com sucesso\nQual a operação desejada?\nDigite 6 para rexibir as opções\n");
}

async function updateAPerson() {
    
    let userId = await askQuestion("Qual o ID desejado?\n");
    let userName = await askQuestion("Qual o nome do usuário?\n");
    let howManyPets = await askQuestion("Qual o nome do usuário?\n");
    let index = 1
    let pets = []

    
    while (index <=parseInt(howManyPets)) {
        let petName = await askQuestion("Qual o nome do pet?\n")
        let petCategory = await askQuestion("Qual a categoria do pet? (por enquanto, esse campo é livre)\n")
        pets.push({ name: petName, category: petCategory})
        index++;
    }
    let user = {
        name: userName,
        pets
    }
    let response = await instance.put(`${DEFAULT_PATH_RESOURCE}/${userId}`, user);
    console.log(JSON.stringify(response.data))
    askOperation("Depois dessa atualização braba\nQual a operação desejada?\nDigite 6 para rexibir as opções");
}

async function deleteAPerson() {
    let userInput = await askQuestion("Qual o ID desejado?");
    let response = await instance.delete(`${DEFAULT_PATH_RESOURCE}/${userInput}`)
    console.log(JSON.stringify(response.data))
    askOperation("Ufa, criadinho com sucesso\nQual a operação desejada?\nDigite 6 para rexibir as opções\n");
}

console.log("Olá!");
console.log("Bem vindo ao cliente mais bugado que o do league of legends. Não tenho muitas funções");
console.log("As coisas que você pode fazer (pelo menos por enquanto, pretendo fazer mais coisas futuramente) :");
printOptions();

