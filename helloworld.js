var http = require('http'),
    fs = require('fs');
console.log('test');

function serverStaticFile(res, path, contentType, responseCode) {
    if(!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function (err, data) {
        if(err) {
            res.writeHead(500, {'Content-Type': 'text/plan'});
            res.end('500 - Internal Error');
        } else{
            res.writeHead(responseCode, {'Content-Type': contentType});
            res.end(data);
        }
    })
}
http.createServer(function (req, res) {
    var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLocaleLowerCase();
    switch (path){
        case '':
            res.writeHead(200, {'Content-Type': 'Text/pain'});
            serverStaticFile(res, '/public/home.html', 'text/html');
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'Text/pain'});
            res.end('Hello World2!!!')
            break;
        default:
            res.writeHead(404, {'Content-Type': 'Text/pain'});
            res.end('Не найдено');
    }
}).listen(3000);