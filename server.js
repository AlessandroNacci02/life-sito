const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;
const FILE = './reviews.json';
const ADMIN_PASS = '080917';

app.use(cors());
app.use(express.json());

// Leggi recensioni
app.get('/api/reviews', (req, res) => {
  fs.readFile(FILE, (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// Salva nuova recensione (aggiunge id univoco)
app.post('/api/reviews', (req, res) => {
  const review = req.body;
  review.id = Date.now().toString(); // aggiungi id univoco
  fs.readFile(FILE, (err, data) => {
    let reviews = [];
    if (!err) reviews = JSON.parse(data);
    reviews.push(review);
    fs.writeFile(FILE, JSON.stringify(reviews, null, 2), () => {
      res.json({ id: review.id, ok: true }); // restituisci id
    });
  });
});

// Cancella una recensione (solo admin)
app.delete('/api/reviews/:id', (req, res) => {
  const pass = req.headers['x-admin-pass'];
  if (pass !== ADMIN_PASS) return res.status(403).json({ error: 'Password admin errata' });
  const id = req.params.id;
  fs.readFile(FILE, (err, data) => {
    if (err) return res.status(500).json({ error: 'Errore lettura file' });
    let reviews = JSON.parse(data);
    const idx = reviews.findIndex(r => r.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Recensione non trovata' });
    reviews.splice(idx, 1);
    fs.writeFile(FILE, JSON.stringify(reviews, null, 2), () => {
      res.json({ ok: true });
    });
  });
});

app.listen(PORT, () => console.log('Server avviato su http://localhost:' + PORT));