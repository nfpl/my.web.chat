:root {
    --primary-color: #2A2F4F;
    --secondary-color: #917FB3;
    --accent-color: #E5BEEC;
    --background: #FDE2F3;
    --text-dark: #2A2F4F;
    --text-light: #FDE2F3;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

body {
    background: var(--background);
    color: var(--text-dark);
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
}

/* Design Moderno do Login */
.auth-card {
    background: white;
    padding: 2.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 440px;
    transition: transform 0.3s ease;
}

.auth-card:hover {
    transform: translateY(-5px);
}

.brand-header {
    text-align: center;
    margin-bottom: 2rem;
}

.brand-header i {
    font-size: 3.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

/* Design Profissional do Chat */
.chat-container {
    display: flex;
    width: 100%;
    max-width: 1200px;
    height: 90vh;
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    overflow: hidden;
}

.chat-sidebar {
    width: 280px;
    background: var(--primary-color);
    color: var(--text-light);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Estilos completos disponíveis no GitHub */