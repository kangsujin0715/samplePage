const http = require('http');
const server = http.createServer();
const PORT = 4500;
const fs = require('fs').promises;
const fsExit = require('fs');
const path = require('path');

// server.request(()=>{})
server.on("request", async (req, res) => {
    console.log(req.method, req.url);

    const extName = path.extname(req.url); //확장자 뽑아내기
    let contentType = 'text/html; charset=utf-8';

    switch (extName) {
        case '.png':
            contentType = 'image/png'; break;
        case '.gif':
            contentType = 'image/gif'; break;
        case '.jpg':
            contentType = 'image/jpg'; break;
        case '.svg':
            contentType = 'image/svg'; break;
        case '.webp':
            contentType = 'image/webp'; break;
        case '.css':
            contentType = 'text/css'; break;
        case '.js':
            contentType = 'text/javascript'; break;
    }
    console.log(contentType);
    

    if(req.url === '/'){    
        const data = await fs.readFile('./views/index.html', 'utf-8');
        res.setHeader('Content-Type', contentType);
        res.write(data);
        res.end();
    }

    if(req.url === '/about'){    
        const data = await fs.readFile('./views/about.html', 'utf-8');
        res.setHeader('Content-Type', contentType);
        res.write(data);
        res.end();
    }

    if(req.url === '/product'){    
        const data = await fs.readFile('./views/product.html', 'utf-8');
        res.setHeader('Content-Type', contentType);
        res.write(data);
        res.end();
    }
    
    if(req.url.includes('/common.css')){    
        const data = await fs.readFile('./styles/common.css', 'utf-8');
        res.setHeader('Content-Type', contentType);
        res.write(data);
        res.end();
    }
    
    if(req.url.includes('/jquery-3.7.1.js')){    
        const data = await fs.readFile('./scripts/jquery-3.7.1.js');
        res.setHeader('Content-Type', contentType);
        res.write(data);
        res.end();
    }

    if(req.url.includes('.png') || req.url.includes('.jpg') || req.url.includes('.gif')){   
        const data = await fs.readFile(path.join(__dirname, req.url));
        const extName = path.extname(req.url)
        res.setHeader('Content-Type', `image/${extName}`);
        res.write(data);
        res.end();
    }
    
});


server.listen(PORT, () => {
    console.log(`${PORT} START ON`);
});


