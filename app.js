 
// Configurações
const AI_NAME = "Assistente";
const USER_NAME = "Você";
const AI_AVATAR = "🤖";
const USER_AVATAR = "👤";

// Sistema de Chat com IA
class AIChatSystem {
    constructor() {
        this.ai = new AICore();
        this.messages = this.loadMessages();
        this.setupEventListeners();
        this.trainInitialAI();
    }

    loadMessages() {
        return JSON.parse(localStorage.getItem('aiChatMessages')) || [
            {
                content: "Olá! Sou uma IA em desenvolvimento. Como posso ajudar?",
                sender: AI_NAME,
                avatar: AI_AVATAR,
                timestamp: new Date().toISOString()
            }
        ];
    }

    trainInitialAI() {
        // Conhecimento básico inicial
        this.ai.learn("Qual é seu nome?", `Meu nome é ${AI_NAME}`);
        this.ai.learn("Quem é você?", `Sou ${AI_NAME}, uma IA de aprendizado`);
        this.ai.learn("Oi", "Olá! Como posso ajudar?");
    }

    addMessage(content, sender, avatar) {
        const message = {
            content,
            sender,
            avatar,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(message);
        localStorage.setItem('aiChatMessages', JSON.stringify(this.messages));
        this.renderMessages();
        
        // Scroll para a última mensagem
        const container = document.getElementById('chat-messages');
        container.scrollTop = container.scrollHeight;
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = this.messages.map(msg => `
            <div class="message ${msg.sender === AI_NAME ? 'ai-message' : 'user-message'}">
                <div class="message-avatar">${msg.avatar}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender">${msg.sender}</span>
                        <span class="time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div class="message-text">${msg.content}</div>
                </div>
            </div>
        `).join('');
    }

    processUserInput(input) {
        this.addMessage(input, USER_NAME, USER_AVATAR);
        
        // Processar com IA
        setTimeout(() => {
            const response = this.ai.query(input);
            this.addMessage(response, AI_NAME, AI_AVATAR);
            
            // Aprendizado contínuo
            if(response.includes("não entendo")) {
                this.ai.learn(input, prompt(`Como devo responder a: "${input}"?`));
            }
        }, 500);
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('messageInput');

        sendBtn.addEventListener('click', () => {
            if(input.value.trim()) {
                this.processUserInput(input.value.trim());
                input.value = '';
            }
        });

        input.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }
}

// Iniciar chat quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AIChatSystem();
});
