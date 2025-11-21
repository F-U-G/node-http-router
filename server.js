import http from 'http';
import { logger, postMW } from './src/middleware.js';
import { handleHomePg, handleAboutPg, handleTestApi } from './src/handlers.js';
const PORT = process.env.PORT;

class HttpError extends Error { // Extending the Error class so that we can pass http codes
  constructor(message, errorCode) {
    super(message);
    this.name = "HTTPError";
    this.errorCode = errorCode;
  }
}

let testJson = [
  { hello: 'world', ur: 'gay', id: 1 },
  { hello: 'John', ur: 'extra gay', id: 2 },
  { hello: 'gamer', ur: 'not gay', id: 3 }
];

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  logger(req, res, () => {
    try {
      if (req.method === 'GET') {

        switch (req.url) {
          case '/':
            handleHomePg(req, res);
            break;
          case '/About':
            handleAboutPg(req, res);
            break;
          case '/api/test': // add a regex check for just /api/ and handle multiple apis within
            handleTestApi(req, res, testJson);
            break;
          default:
            throw new HttpError('Page Not Found', 404);
        }

      } else if (req.method == 'POST') {

        postMW(req, res, (body) => {
          switch (req.url) {
            case '/api/test':
              //error handle here for body
              req.on('end', () => {
                testJson.push(JSON.parse(body));
                res.statusCode = 201;
                res.write(JSON.stringify(testJson));
                res.end()
              });
              break;
            // case '/api/users':
            //   //handleUserPost
            //   req.on('end', () => {
            //     res.statusCode = 201;
            //     res.write();
            //     res.end()
            //   });
            //   break;
            default:
              try {
                throw new HttpError('Page Not Found', 404);
              } catch (error) {
                console.log(error);
                res.writeHead(error.errorCode, { 'Content-Type': 'text/plain' });
                res.end(`${error.message}`);
              }
          }
        });

      } else {
        throw new HttpError('Method not correct, use GET or POST', 400);
      }
    } catch (error) {
      console.log(error);
      res.writeHead(error.errorCode, { 'Content-Type': 'text/plain' });
      res.end(`${error.message}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
