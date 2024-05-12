const socket = io()
const clientstotal = document.getElementById('clients-total')
const messagecontainer = document.getElementById('message-container')
const nameinput = document.getElementById('name-input')
const messageform = document.getElementById('message-form')
const messageinput = document.getElementById('message-input')

messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
});

socket.on('clients-total', (data) => {
    clientstotal.innerHTML = `Total Clients: ${data}`
});

function sendMessage() {
    if (messageinput.value === '') return
    
    const data = {
        name: nameinput.value || 'Anonymous',
        message: messageinput.value,
        datetime: new Date()
    };

    socket.emit('message', data)
    addMessageToUI(true, data)
    messageinput.value = ''
}

socket.on('chat-message', (data) => {
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
                ${data.message}
                <span>${data.name} | ${moment(data.datetime).fromNow()}</span>
            </p>
        </li>`

    messagecontainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom() {
    messagecontainer.scrollTo(0, messagecontainer.scrollHeight)
}

messageinput.addEventListener('input', () => {
    socket.emit('feedback', {
        feedback: `${nameinput.value || 'Anonymous'} is typing a message`
    })
})

messageinput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`

    messagecontainer.innerHTML += element

})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}
