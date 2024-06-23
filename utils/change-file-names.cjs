const fs = require('fs');
const path = require('path');

const directoryPath = '../public/assets/raw-tiles';

try {
  // 디렉토리 내의 모든 파일 읽기
  const files = fs.readdirSync(directoryPath);

  files.forEach(file => {
    // 파일의 현재 경로
    const oldPath = path.join(directoryPath, file);
    // 새 파일명 (확장자 추가)
    const newPath = path.join(directoryPath, `${file}.png`);

    // 파일 이름에 이미 확장자가 없는 경우에만 이름 변경
    if (path.extname(file) === '') {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} to ${file}.png`);
    } else {
      console.log(`Skipped: ${file} (already has an extension)`);
    }
  });

  console.log('All files have been processed.');
} catch (err) {
  console.error('An error occurred:', err);
}