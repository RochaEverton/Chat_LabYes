require('dotenv').config();
const express = require('express');
const fs = require('fs-extra');
const path = require('path')
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT;
const mensagensFile = './mensagens.json';

let mensagens = [];

fs.readJson(mensagensFile).then(data => {
  mensagens = data;
}).catch(() => {
  mensagens = [];
});


app.get('/env', (req, res) => {
  res.json({ senha: process.env.CHAT_PASSWORD });
});

io.on('connection', (socket) => {
  socket.emit('historico', mensagens);

  socket.on('chat message', (msg) => {
    mensagens.push(msg);
    fs.writeJson(mensagensFile, mensagens);
    io.emit('chat message', msg);
  });
});


http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
