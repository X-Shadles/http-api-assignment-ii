const http = require('http');
const url = require('url');

const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCss,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notReal,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/notReal': jsonHandler.notRealMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
  }
};


const onPosting = (request, response) => {
    const res = response;
    const body = [];

    request.on('error', () => {
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {

      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, res, bodyParams);
    });
};

const onGetting = (request, response, parsedUrl) => {

  if (urlStruct[request.method][parsedUrl.pathname]) {
     urlStruct[request.method][parsedUrl.pathname](request, response);
 } else {
     urlStruct[request.method].notFound(request, response);
 }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST' && parsedUrl.pathname === '/addUser') {
    onPosting(request, response, parsedUrl);
  } else {
    onGetting(request, response, parsedUrl);
  }
};


http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);