require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configuração do servidor
const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro MongoDB:', err));

// Modelo de conhecimento da IA
const Knowledge = mongoose.model('Knowledge', new mongoose.Schema({
  input: { type: String, required: true, unique: true },
  output: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// API de aprendizado
app.post('/api/learn', async (req, res) => {
  try {
    const { input, output } = req.body;
    await Knowledge.findOneAndUpdate(
      { input },
      { output },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API de consulta
app.post('/api/query', async (req, res) => {
  try {
    const { input } = req.body;
    const knowledge = await Knowledge.findOne({ input });
    
    if (knowledge) {
      return res.json({ output: knowledge.output });
    }

    // Busca por correspondência aproximada
    const similar = await Knowledge.aggregate([
      {
        $search: {
          index: 'knowledge_search',
          text: {
            query: input,
            path: 'input',
            fuzzy: {}
          }
        }
      },
      { $limit: 1 }
    ]);

    if (similar.length > 0) {
      return res.json({ 
        output: similar[0].output,
        unsure: true
      });
    }

    res.json({ output: "Não sei responder isso ainda. Me ensine?" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
