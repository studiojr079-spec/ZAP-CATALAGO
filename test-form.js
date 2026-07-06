const FormData = require('form-data');
const form = new FormData();
form.append('test', undefined);
console.log(form);
