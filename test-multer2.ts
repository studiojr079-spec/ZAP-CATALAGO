import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/test', upload.array('images'), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const urls = files.map(f => f.filename);
    res.json({ success: true, urls });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const server = app.listen(3003, async () => {
  const form = new FormData();
  form.append('productData', '{"test": 1}');
  
  const res = await fetch('http://localhost:3003/api/test', {
    method: 'POST',
    body: form
  });
  console.log(res.status, await res.text());
  server.close();
});
