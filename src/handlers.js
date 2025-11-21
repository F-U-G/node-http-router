import url from 'url';
import fs from 'fs/promises';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleHomePg = (async (req, res) => {
  const filePath = path.join(__dirname, '../public', 'index.html');
  const data = await fs.readFile(filePath);
  res.setHeader('Content-Type', 'text/html')
  res.write(data);
  res.end();
});

export const handleAboutPg = (async (req, res) => {
  const filePath = path.join(__dirname, '../public', 'about.html');
  const data = await fs.readFile(filePath);
  res.setHeader('Content-Type', 'text/html');
  res.write(data);
  res.end();
});

export const handleTestApi = ((req, res, json) => {
  res.setHeader('Content-Type', 'aplication/json');
  res.write(JSON.stringify(json));
  res.end();
});
