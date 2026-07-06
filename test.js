const fetch = require('node-fetch');
fetch('https://google.com', { headers: { 'Authorization': '' } })
  .then(res => console.log(res.status))
  .catch(err => console.log("ERR", err));
