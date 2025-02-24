let express = require('express');

let app = express();

app.use(express.static(__dirname + '/dist/qualifier'));

app.get('/*', (req, resp) =>{
    resp.sendFile(__dirname + '/dist/qualifier/index.html');
});

app.listen(process.env.PORT || 8080);