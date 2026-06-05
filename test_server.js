var http = require('http');
var express = require('express');

var app = express();

var server = http.createServer(app).listen(3000, function() {
    console.log('서버가 실행 되었습니다 : ', 3000);
});

// chat_ex1.js 서버에서 모듈을 진행한다.
require("./chat_ex01")(server);