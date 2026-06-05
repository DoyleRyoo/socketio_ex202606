const socket = io();

const statusEl = document.querySelector('#status');
const messagesEl = document.querySelector('#messages');
const nameForm = document.querySelector('#name-form');
const usernameInput = document.querySelector('#username');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message');

function formatTime(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function addMessage({ username, text, createdAt, system = false }) {
  const item = document.createElement('li');
  item.className = system ? 'message system' : 'message';

  const meta = document.createElement('div');
  meta.className = 'message-meta';

  const author = document.createElement('strong');
  author.textContent = system ? 'System' : username;

  const time = document.createElement('time');
  time.dateTime = createdAt;
  time.textContent = formatTime(createdAt);

  const body = document.createElement('div');
  body.className = 'message-text';
  body.textContent = text;

  meta.append(author, time);
  item.append(meta, body);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on('connect', () => {
  statusEl.textContent = 'Connected';
  statusEl.classList.add('connected');
});

socket.on('disconnect', () => {
  statusEl.textContent = 'Offline';
  statusEl.classList.remove('connected');
});

socket.on('system:message', (message) => {
  addMessage({ ...message, system: true });
});

socket.on('chat:message', (message) => {
  addMessage(message);
});

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('user:setName', usernameInput.value);
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) {
    return;
  }

  socket.emit('chat:message', text);
  messageInput.value = '';
  messageInput.focus();
});
