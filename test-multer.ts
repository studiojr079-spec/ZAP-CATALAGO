import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/test', upload.array('images'), (req, res) => {
  res.json({ success: true, body: req.body });
});

const server = app.listen(3002, async () => {
  const form = new FormData();
  form.append('productData', '{"test": 1}');
  
  const res = await fetch('http://localhost:3002/api/test', {
    method: 'POST',
    body: form
  });
  console.log(res.status, await res.text());
  server.close();
});
