const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'potholes.geojson');

// 初期化
async function init() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({
            type: 'FeatureCollection',
            features: []
        }, null, 2));
    }
}

// サーバー
const server = http.createServer(async (req, res) => {
    const { pathname } = url.parse(req.url);
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        // HTMLファイル
        if (pathname === '/' || pathname === '/index.html') {
            const html = await fs.readFile('index.html', 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }
        
        // GET: データ取得
        if (pathname === '/api/potholes' && req.method === 'GET') {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
            return;
        }
        
        // POST: 記録追加
        if (pathname === '/api/potholes' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const { coordinates, description } = JSON.parse(body);
                const geojson = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
                
                const feature = {
                    type: 'Feature',
                    id: Date.now().toString(),
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    properties: {
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString(),
                        description: description || ''
                    }
                };
                
                geojson.features.push(feature);
                await fs.writeFile(DATA_FILE, JSON.stringify(geojson, null, 2));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
            return;
        }
        
        // DELETE: 個別削除
        if (pathname.startsWith('/api/potholes/') && req.method === 'DELETE') {
            const id = pathname.split('/').pop();
            const geojson = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
            
            geojson.features = geojson.features.filter(f => f.properties.id !== id);
            await fs.writeFile(DATA_FILE, JSON.stringify(geojson, null, 2));
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return;
        }
        
        // DELETE: 全削除
        if (pathname === '/api/clear' && req.method === 'DELETE') {
            await fs.writeFile(DATA_FILE, JSON.stringify({
                type: 'FeatureCollection',
                features: []
            }, null, 2));
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return;
        }
        
        res.writeHead(404);
        res.end('Not found');
        
    } catch (error) {
        res.writeHead(500);
        res.end(error.message);
    }
});

// 起動
init().then(() => {
    server.listen(PORT, () => {
        console.log(`サーバー起動: http://localhost:${PORT}`);
    });
});