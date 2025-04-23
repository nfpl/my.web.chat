const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-sistema-forte')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

// Rotas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API do Sistema Forte está rodando');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
