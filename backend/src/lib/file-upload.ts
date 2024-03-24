import * as path from 'path';
import * as fs from 'fs';

import { HttpException, HttpStatus } from '@nestjs/common';

// Разрешить только изображения
export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return callback(
            new HttpException(
                'Only image files are allowed!',
                HttpStatus.BAD_REQUEST,
            ),
            false,
        );
    }
    callback(null, true);
};

// Созадние папки фотографий отелья
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = path.extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
};

export const destination = (req, file, cb) => {
    const pathFile = path.join(
        __dirname,
        '../../',
        `/public/images/hotel/${req.params.id.slice(1)}`,
    );

    if (!fs.existsSync(pathFile)) {
        fs.mkdirSync(pathFile, { recursive: true });
    }

    cb(null, pathFile);
};

export const destinationhotelRoom = (req, file, cb) => {
    const pathFile = path.join(
        __dirname,
        '../../',
        `/public/images/hotel-room/${req.body.id}`,
    );

    if (!fs.existsSync(pathFile)) {
        fs.mkdirSync(pathFile, { recursive: true });
    }
    cb(null, pathFile);
};