let express = require('express');

let app = express();

app.use(express.static(__dirname + '/dist/pangolin'));

app.get('/*', (req, resp) =>{
    resp.sendFile(__dirname + '/dist/pangolin/index.html');
});

app.listen(process.env.PORT || 8080);