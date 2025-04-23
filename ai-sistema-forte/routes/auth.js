const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../auth.json');

// Registro de usuário
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe' });
    }

    const user = await User.create({ username, email, password });
    user.password = undefined;
    
    return res.send({ 
      user,
      token: generateToken({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: 'Falha no registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(400).send({ error: 'Usuário não encontrado' });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Senha inválida' });
  }

  user.password = undefined;
  
  res.send({ 
    user, 
    token: generateToken({ id: user.id }) 
  });
});

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

module.exports = router;
