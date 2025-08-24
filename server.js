const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;
const FILE = './reviews.json';

app.use(cors());
app.use(express.json());

// Leggi recensioni
app.get('/api/reviews', (req, res) => {
  fs.readFile(FILE, (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// Salva nuova recensione
app.post('/api/reviews', (req, res) => {
  const review = req.body;
  fs.readFile(FILE, (err, data) => {
    let reviews = [];
    if (!err) reviews = JSON.parse(data);
    reviews.push(review);
    fs.writeFile(FILE, JSON.stringify(reviews, null, 2), () => {
      res.json({ok:true});
    });
  });
});

app.listen(PORT, () => console.log('Server avviato su http://localhost:' + PORT));