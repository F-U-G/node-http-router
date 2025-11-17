import http from 'http';
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
const PORT = process.env.PORT;

class HttpError extends Error { // Extending the Error class so that we can pass http codes
  constructor(message, errorCode) {
    super(message);
    this.name = "HTTPError";
    this.errorCode = errorCode;
  }
}

const testJson = [
  { hello: 'world', ur: 'gay', id: 1 },
  { hello: 'John', ur: 'extra gay', id: 2 },
  { hello: 'gamer', ur: 'not gay', id: 3 }
];

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sendResponse(res, type, write) {
  res.setHeader('Content-Type', type)
  res.write(write);
  res.end();
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET') {
      let filePath;
      if (req.url === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
        const data = await fs.readFile(filePath);
        sendResponse(res, 'text/html', data)

      } else if (req.url === '/About') {
        filePath = path.join(__dirname, 'public', 'about.html');
        const data = await fs.readFile(filePath);
        sendResponse(res, 'text/html', data)

      } else if (req.url === '/api/test') {
        sendResponse(res, 'aplication/json', JSON.stringify(testJson));

      } else {
        throw new HttpError('Page Not Found', 404);
      }

    } else {
      throw new HttpError('Method not correct, use GET', 400);
    }
  } catch (error) {
    console.log(error);
    res.writeHead(error.errorCode, { 'Content-Type': 'text/plain' });
    res.end(`${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
