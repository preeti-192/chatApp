const socket = io('https://chatapp-75px.onrender.com');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('msgContainer');

// Append messages to the container
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Add position-specific styling
    if (position === 'right') {
        messageElement.classList.add('ml-auto', 'bg-blue-200');
    } else {
        messageElement.classList.add('mr-auto', 'bg-gray-200');
    }

    // Add message text and time
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `<p class="text-sm break-words w-full max-w-[500px]">${message} <span class="text-gray-600 text-[10px] absolute bottom-0 right-0 m-1">${formattedTime}</span></p>`;

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Get the user's name
const name = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name);

// Receive user-joined event
socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'left');
});

// Handle message sending
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Receive messages
socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

// Handle user leaving
socket.on('left', name => {
    appendMessage(`${name} left the chat`, 'left');
});
