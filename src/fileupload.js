const multer = require('multer');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

try {
	fs.readdirSync('files'); // 폴더 확인
} catch(err) {
	console.error('files 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('files'); // 폴더 생성
}


const imageUploader = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            done(null, 'files/images/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            const tfilename = Buffer.from(file.originalname,'latin1').toString('utf8');
            
            done(null, path.basename(tfilename, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10메가로 용량 제한
});

const fileUploader = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            done(null, 'files/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            const tfilename = Buffer.from(file.originalname,'latin1').toString('utf8');
            
            done(null, path.basename(tfilename, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10메가로 용량 제한
});

module.exports={imageUploader,fileUploader};