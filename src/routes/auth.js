const express = require('express');
const router = express.Router();

// Placeholder para controladores
router.post('/register', (req, res) => {
  res.json({ message: 'Endpoint de registro - En desarrollo' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Endpoint de login - En desarrollo' });
});

module.exports = router;