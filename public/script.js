const socket = io();
let nome = '';
let senhaDoServidor = '';

const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

loginDiv.style.display = 'block';

fetch('/env')
  .then(res => res.json())
  .then(data => {
    senhaDoServidor = data.senha;
  });

function entrar() {
  if (passwordInput.value === senhaDoServidor && usernameInput.value.trim() !== '') {
    nome = usernameInput.value.trim();
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  } else {
    loginError.textContent = 'Nome ou senha inválidos!';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { nome: nome, texto: input.value });
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = `${msg.nome}: ${msg.texto}`;
  messages.appendChild(li);
});

socket.on('historico', (msgs) => {
  msgs.forEach((msg) => {
    const li = document.createElement('li');
    li.textContent = `${msg.nome}: ${msg.texto}`;
    messages.appendChild(li);
  });
});
