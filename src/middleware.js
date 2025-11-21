export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}

export const jsonMW = (req, res, next) => {
  res.setHeader('Content-Type', 'aplication/json');
  next();
}

export const htmlMW = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html');
  next();
}

export const postMW = async (req, res, next) => {
  let body = '';
  await req.on('data', (chunk) => {
    body += chunk.toString();
  });
  next(body);
}
