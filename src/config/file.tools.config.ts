import * as fs from 'fs';
import * as path from 'path';

export const base64ToFileAndSave = (base64: string, filePath: string) => {
    try {
        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw 'Invalid base64 data';
        }

        const uploadFile = path.join(__dirname, filePath);
        fs.mkdirSync(path.dirname(uploadFile), { recursive: true });
        fs.writeFileSync(uploadFile, matches[2], 'base64');

    } catch (error) {
        console.log("[Error] base64ToFileAndSave: ", error)
    }
}

export const removeFile = (filePath: string) => {
    try {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('파일을 삭제하는 중 오류 발생:', err);
            }
        });
    } catch (error) {
        console.log(["[Error] removeFile: "], error)
    }
}