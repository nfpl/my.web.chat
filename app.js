// Configuração (mude para true para usar Firebase)
const USE_FIREBASE = false;

// Sistema de Chat
class ProfessionalChat {
    constructor() {
        this.messages = [];
        this.init().then(() => {
            this.renderMessages();
        });
    }

    async init() {
        if(USE_FIREBASE) {
            // Configuração do Firebase
            const firebaseConfig = {
                apiKey: "SUA_CHAVE_API",
                authDomain: "SEU_DOMINIO.firebaseapp.com",
                projectId: "SEU_PROJETO",
                storageBucket: "SEU_BUCKET.appspot.com",
                messagingSenderId: "SEU_SENDER_ID",
                appId: "SEU_APP_ID"
            };
            
            // Inicializar Firebase
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            await this.loadMessagesFromFirebase();
        } else {
            // Modo local (GitHub Pages)
            this.messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        }
    }

    async loadMessagesFromFirebase() {
        const snapshot = await this.db.collection("messages").orderBy("timestamp").get();
        this.messages = snapshot.docs.map(doc => doc.data());
    }

    init() {
        this.renderMessages();
        this.setupEventListeners();
        this.setupEmojiPicker();
    }

    addMessage(content) {
        const message = {
            content,
            timestamp: new Date().toISOString(),
            user: 'admin'
        };
        this.messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        this.renderMessages();
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = this.messages.map(msg => `
            <div class="message">
                <div class="message-header">
                    <span class="user">${msg.user}</span>
                    <span class="time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="message-content">${msg.content}</div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    setupEmojiPicker() {
        const emojis = document.querySelectorAll('.emoji-picker span');
        const input = document.getElementById('messageInput');
        
        emojis.forEach(emoji => {
            emoji.addEventListener('click', () => {
                input.value += emoji.textContent;
                input.focus();
            });
        });
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('messageInput');

        // Acessibilidade
        sendBtn.setAttribute('aria-label', 'Enviar mensagem');
        input.setAttribute('aria-label', 'Digite sua mensagem');
        input.setAttribute('placeholder', 'Digite sua mensagem...');

        sendBtn.addEventListener('click', () => {
            if(input.value.trim()) {
                this.addMessage(input.value.trim());
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

function showChatInterface() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    new ProfessionalChat();
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 3000);
    } else {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const auth = authService;
    const loginForm = document.getElementById('loginForm');
    
    // Acessibilidade
    document.getElementById('username').setAttribute('placeholder', 'Digite seu usuário');
    document.getElementById('password').setAttribute('placeholder', 'Digite sua senha');
    document.getElementById('logoutBtn').setAttribute('aria-label', 'Sair do chat');

    // Sistema de Autenticação
    if(auth.validateSession()) {
        showChatInterface();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if(auth.authenticate(username, password)) {
            auth.startSession();
            showChatInterface();
        } else {
            showError('Credenciais inválidas');
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.endSession();
        window.location.reload();
    });
});
