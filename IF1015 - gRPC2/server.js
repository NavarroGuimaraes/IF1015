const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const SERVER_ADDRESS = "127.0.0.1:4242";

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

let users = [];

function join(data, callback) {
  users.push(data);
  const text = (users.length-1 > 0) ?
                    `Bem vindo a bordo! Com você, temos ${users.length - 1} usuários conosco!` 
                    : `Você está sozinho por enquanto. Aguardando outras pessoas conectarem!`
  newcomerNotification({ 
    user: 'Server', 
    text: text,
    userJoining: data.metadata.get('user')});
};

const leave = (call, callback) => {
  let shouldSkip = false;
  users.forEach(user => {
    if (shouldSkip){
      return;
    }
    const currentUser = user.metadata.get('user');
    if (currentUser == call.request.user){
      const index = users.indexOf(user);
      const leavingUser = users.splice(index, 1)[0];
      leavingUser.end();
      callback(null, {user: leavingUser.metadata.get('user')});
      shouldSkip = true;
      return;
    }
  });
  notifyAllUsers({ user: 'Server', text: `${call.request.user} Nos abandonou! Passem a odiar essa pessoa imediatamente.` });
}

const send = (call, callback) => {
  notifyAllUsers(call.request);
}

const newcomerNotification = (message) => {

    users.forEach(user => {

        const currUser = user.metadata.get('user');
        if (currUser == message.userJoining) {
            user.write(message);
            return;
        } 

        user.write({user: 'Server', text: `${message.userJoining} Acabou de entrar.`})
        
    });

}

const notifyAllUsers = (message) => {
  users.forEach(user => {
      user.write(message);
  });
}

server.addService(proto.chatPackage.Chat.service, { join: join, send: send, leave: leave });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();
console.log("🚀 Pronto para receber conversas!");