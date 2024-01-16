(function () {
    var css = `
    h1, p {
        color: black;
    }

    .chat-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-left: 5px;
        z-index: 999;
        height: 70px;
    }

    .chat-bot-image {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }

    .chat-title {
        font-size: 10px;
        margin-top: 10px;
        align-self: flex-start;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        margin-top: 15px;
        margin-right: 15px;
        cursor: pointer;
        font-size: 1.2em;
    }

    .assistant-text {
        font-size: 14px;
        margin-top: 0;
    }

    .chat-activation-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        z-index: 1000;
        margin-right: 20px;
    }

    .chat-activation-container img {
        width: 80px;
        height: 80px;
    }

    .initial-message {
        cursor: pointer;
        background-color: rgba(21, 147, 250, 0.767);
        color: white;
        border-radius: 10px;
        padding: 15px 20px;
        margin-right: 10px;
        border: none;
        user-select: none;
    }

    .chat-activation-image {
        cursor: pointer;
    }

    .chatbot-interface {
        display: flex;
        flex-direction: column;
        max-height: 100%;
        overflow-y: auto;
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 320px;
        height: 520px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 999;
    }

    .input-bottom {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .input-container {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        padding-left: 10px;
        padding-bottom: 10px;
        padding-right: 30px;
        border: none;
        border-bottom: 1px solid #ccc;
    }

    .input-container input {
        flex-grow: 1;
        border: none;
        outline: none;
        background-color: rgba(241, 239, 239, 0.562);
        height: 30px;
        border-radius: 5px;
        padding: 10px;
        margin-right: 0;
        font-size: 12px;
    }

    .input-container .bi-send {
        margin-left: 20px;
        cursor: pointer;
        transform: rotate(45deg);
        font-size: 20px;
    }

    .messages-container {
        overflow-y: auto;
    }

    .message {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
    }

    .bot-message,
    .user-message {
        color: #333;
        max-width: 70%;
        border-radius: 20px;
        padding: 10px;
        font-size: 12px;
    }

    .bot-message {
        align-self: flex-start;
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: rgba(241, 239, 239, 0.562);
    }

    .user-message {
        align-self: flex-end;
        margin-bottom: 10px;
        background-color: #cecece;
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        margin-top
: 70px;
height: calc(100% - 70px - 50px);
font-size: 12px;
}
.chatbot-interface button,
.chatbot-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    color: #333;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    margin: 5px;
    border: 1px solid #ccc;
    font-size: 12px;
}

.chatbot-interface .bot-message button {
    color: #333;
}

.chatbot-interface button:hover {
    background-color: #cccccc;
}

.chatbot-interface button:focus {
    outline: none;
}

.chatbot-button:hover {
    color: #33333373;
}

.divider-line {
    border-top: 1px solid #ccc;
    margin: 10px 0;
    margin-left: 10px;
    width: 90%;
}`;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    function createActivationButton() {
        var button = document.createElement('button');
        button.textContent = 'Oi, tudo bem? Posso ajudar?';
        button.classList.add('chatbot-activation-button');
        button.onclick = toggleChatbot;
        return button;
    }

    function createActivationImage() {
        var image = document.createElement('img');
        image.src = '../assets/image/imagem_bot_redome_redonda.png';
        image.className = 'chat-activation-image';
        image.onclick = toggleChatbot;
        return image;
    }

    function createMessageInput() {
        var inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        var inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Digite sua dúvida';
        inputField.onkeyup = function (event) {
            if (event.key === 'Enter') {
                sendMessage(inputField.value);
                inputField.value = '';
            }
        };

        var sendButton = document.createElement('i');
        sendButton.className = 'bi bi-send';
        sendButton.onclick = function () {
            sendMessage(inputField.value);
            inputField.value = '';
        };

        inputContainer.appendChild(inputField);
        inputContainer.appendChild(sendButton);

        return inputContainer;
    }

    function createChatInterface() {
        var chatInterface = document.createElement('div');
        chatInterface.id = 'chatbotInterface';
        chatInterface.classList.add('chatbot-interface', 'input-bottom');
        chatInterface.style.display = 'none';

        var messageInput = createMessageInput();
        chatInterface.appendChild(messageInput);

        return chatInterface;
    }

    function sendMessage(messageText) {
        if (!messageText.trim()) return;
    
        displayMessage(messageText, 'user');

        sendMessageToDialogflow(messageText);
    
        setTimeout(function() {
            var responseText = 'Resposta simulada para: ' + messageText;
            displayMessage(responseText, 'bot');
        }, 1000);
    }

    function displayMessage(text, sender) {
        var chatContainer = document.getElementById('chatbotInterface');
        var messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageElement.textContent = text;
        chatContainer.appendChild(messageElement);
    
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessageToDialogflow(messageText) {
        var url = 'https://bot-redome-api.onrender.com/dialogflow'; 
        var data = {
            message: messageText,
        };
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            var responseText = data.responseText; 
            displayMessage(responseText, 'bot');
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            displayMessage('Houve um erro ao enviar a mensagem.', 'bot');
        });
    }

    function toggleChatbot() {
        var chatInterface = document.getElementById('chatbotInterface');
        var isDisplayed = chatInterface.style.display !== 'none';
        chatInterface.style.display = isDisplayed ? 'none' : 'block';
    }

    function appendChatbotToBody() {
        var body = document.body;
        var chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbotContainer';

        var activationButton = createActivationButton();
        var chatInterface = createChatInterface();

        chatbotContainer.appendChild(activationButton);
        chatbotContainer.appendChild(chatInterface);

        body.appendChild(chatbotContainer);
    }

    appendChatbotToBody();
})();
