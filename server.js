const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3001;

app.get('/', (request,response) => {
    response.send('Welcome to nearby places API');
}); 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});