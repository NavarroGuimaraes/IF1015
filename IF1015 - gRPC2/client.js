const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = "127.0.0.1:4242";

let client = new proto.chatPackage.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

let user;

const onData = (message) => {
    if (message.user == user) {
      return;
    }
    console.log(`${message.user}: ${message.text}`);
}

const handleUserInput = (text) => {
    if(text === "sair"){

        client.leave({ user: user }, (err, response) => {
          if (response.user == user) {
            console.log('Você pulou do barco! (isso quer sair do chat em árabe)')
          }
          rl.close();
          client.close();
        });
        return;
      } 
      
    client.send({ user: user, text: text }, response => {});
      
}
  
const startChat = () => {
  const metadata = new grpc.Metadata();
  metadata.add('user', user);
  const channel = client.join(metadata);

  channel.on("data", onData);

  rl.on("line", handleUserInput);
}

rl.question("E aí, qual o seu nome? ", userInput => {
  user = userInput;
  startChat();
});