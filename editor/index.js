var http = require('http');
var fs = require('fs');
var path = require('path');

const LEVELS_DIR = "levels";

function ensureDir(dir) {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function processApi(request, response) {
	let body = [];
	request.on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
	 	body = Buffer.concat(body).toString();
		
		let data = JSON.parse(body);
        console.log(data);

        ensureDir(LEVELS_DIR);

        let responseData = {
            status: 'ok'
        };

        switch(data.action) {
            case 'list':
                let files = fs.readdirSync(LEVELS_DIR);
                responseData.list = files.map(x => x.slice(0, -5));
            break;

            case 'get':
                let file = fs.readFileSync(LEVELS_DIR + "/" + data.filename + ".json", { encoding: 'utf8' });
                responseData.level = JSON.parse(file);
            break;
        }

		response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(responseData), 'utf-8');
	});
}

function processFile(request, response) {
	let filePath = './static' + request.url;
    if (filePath.match(/\/$/))
        filePath += 'index.html';

    let extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    console.log(filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

http.createServer(function (request, response) {
    console.log('request starting...');

    let url = request.url;

    if(url.match(/\/api/)) {
    	processApi(request, response);
    } else {
    	processFile(request, response);
    }

}).listen(9000);