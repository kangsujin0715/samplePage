// 필요한 모듈 import
const http = require('http');
const fs = require('fs').promises; // 프로미스를 지원하는 파일 시스템 모듈
const fsExit = require('fs'); // 파일 시스템 모듈
const path = require('path');

// 서버 생성
const server = http.createServer();
const PORT = 4500; // 서버 포트

// 요청 이벤트 리스너 설정
server.on("request", async (req, res) => {
    console.log(req.method, req.url); // 요청 메소드와 URL 출력

    // 요청된 URL의 확장자 추출
    const extName = path.extname(req.url);
    let contentType = 'text/html; charset=utf-8'; // 기본 콘텐츠 타입은 HTML

    // 확장자에 따라 적절한 콘텐츠 타입 설정
    switch (extName) {
        case '.png':
            contentType = 'image/png'; break;
        case '.gif':
            contentType = 'image/gif'; break;
        case '.jpg':
            contentType = 'image/jpeg'; break;
        case '.svg':
            contentType = 'image/svg+xml'; break;
        case '.webp':
            contentType = 'image/webp'; break;
        case '.css':
            contentType = 'text/css'; break;
        case '.js':
            contentType = 'text/javascript'; break;
    }

    console.log(contentType); // 콘텐츠 타입 출력

    // '/login' 경로에 대한 POST 요청인 경우
    if(req.url === '/login' && req.method === 'POST' ){
        console.log('/login post');

        // 요청 본문 데이터를 저장할 변수
        let body = '';

        // 요청 본문 데이터를 chunk 단위로 받아와서 body 변수에 저장
        req.on('data', (chunk)=>{
            body += chunk.toString(); // 요청 본문 데이터를 문자열로 변환하여 저장
        });

        // 요청 본문 데이터를 모두 받은 후에 실행되는 이벤트 핸들러
        req.on('end', async ()=>{
            // 받아온 데이터를 JSON 형식으로 파싱하여 name 변수에 저장
            const {id, pw} = JSON.parse(body);
            console.log(id, pw); // 받아온 사용자 이름 출력

            // 사용자 데이터 파일(user.json)을 읽어옴
            const user_json = await fs.readFile(path.join(__dirname,'/data', 'user.json'), "utf-8");
            console.log(user_json); // 읽어온 사용자 데이터 출력

            // JSON 형식의 사용자 데이터를 JavaScript 객체로 변환
            const user_data = JSON.parse(user_json); // 읽어온 사용자 데이터를 JavaScript 객체로 변환
            console.log(user_data); // 변환된 사용자 데이터 출력

            // 사용자 데이터에 새로운 사용자 정보를 추가
            user_data.push({id, pw}); // 새로운 사용자 정보 추가

            // 데이터 디렉토리가 없으면 생성
            if(!fsExit.existsSync('./data')){
                fsExit.mkdirSync('./data'); // 데이터 디렉토리 생성
            }

            // 사용자 데이터를 다시 user.json 파일에 씀
            fs.writeFile(path.join(__dirname,'/data', 'user.json'),
                JSON.stringify(user_data, null, "  "),
                err => {if(err) console.log(err);} // 사용자 데이터를 파일에 쓰고 에러가 있으면 로그 출력
            );

            // 사용자 추가 완료 메시지 응답
            res.writeHead(200, { 'Content-Type': 'text/plain' }); // 응답 헤더 설정
            res.end('User added successfully'); // 응답 종료
        });

        return; // '/login' 경로에 대한 처리 후에는 더 이상 진행하지 않음
    }

    // 파일 제공 함수 호출
    serveFile(req.url, contentType, res);
});

// 파일 제공 함수
async function serveFile(url, contentType, res) {
    let filePath = '';

    // 요청된 URL에 따라 적절한 파일 경로 설정
    if (url === '/') {
        filePath = './views/index.html'; // 루트 URL일 때는 index.html 제공
        
    } else if (url === '/about') {
        filePath = './views/about.html'; // /about URL일 때는 about.html 제공

    } else if (url === '/product') {
        filePath = './views/product.html'; // /product URL일 때는 product.html 제공

    } else if (url === '/login') {
        filePath = './views/login.html'; // /login URL일 때는 login.html 제공

    } else if (url.includes('/common.css')) {
        filePath = './styles/common.css'; // /common.css URL일 때는 common.css 제공

    } else if (url.includes('/jquery-3.7.1.js')) {
        filePath = './scripts/jquery-3.7.1.js'; // /jquery-3.7.1.js URL일 때는 jquery-3.7.1.js 제공

    } else if (url.includes('.png') || url.includes('.jpg') || url.includes('.gif')) {
        // 이미지 파일의 경우, 디렉토리 위치와 파일 이름 추출하여 파일 경로 설정
        filePath = path.join(__dirname, 'images', path.basename(url));
    }

    try {
        // 파일 읽기
        const data = await fs.readFile(filePath);
        // 콘텐츠 타입 설정
        res.setHeader('Content-Type', contentType);
        // 파일 내용 응답으로 전송
        res.write(data);
        res.end(); // 응답 종료
    } catch (error) {
        // 에러가 발생한 경우 404 에러 반환
        const err = await fs.readFile('./views/error.html'); // 에러 페이지 읽기
        console.error('Error reading file:', error); // 에러 로그 출력
        res.statusCode = 404; // 404 상태 코드 설정
        res.end(err); // 에러 페이지 응답
    }
}


// 서버 포트에서 대기
server.listen(PORT, () => {
    console.log(`${PORT} START ON`);
});