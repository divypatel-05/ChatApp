const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

const users = {};

io.on("connection", (socket) => {
    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        // console.log('User joined:', name);
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("recieve", {message:message, name:users[socket.id]});
    });

    socket.on("disconnect", message => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});

io.engine.on("headers", (headers, request) => {
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "GET, POST";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Allow-Credentials"] = "true";
});

server.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
})

