// Tiny zero-dependency local server for Makhan Run.
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
http.createServer((req,res) => {
  let relative = decodeURIComponent((req.url || '/').split('?')[0]);
  if (relative === '/') relative = '/index.html';
  const file = path.resolve(root, '.' + relative);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err,data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(5173, '0.0.0.0', () => {
  const ips = Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal).map(n => n.address);
  console.log('Makhan Run computer: http://localhost:5173');
  ips.forEach(ip => console.log(`Makhan Run phone:    http://${ip}:5173`));
});
