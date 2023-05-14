"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tinify_1 = require("tinify");
var fs = require("fs");
var path = require("path");
var Table = require("cli-table3");
// Задаем API ключ Tinify API
tinify_1.default.key = "3PGhpC1sZXGlBGpT3LEDzVCVn6iQyyAu";
// Функция, которая обрабатывает все изображения в текущей директории и вызывает себя для всех поддиректорий
var compressImages = function (dir, table) {
    fs.readdirSync(dir).forEach(function (file) {
        var fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            compressImages(fullPath, table);
        }
        else if (path.extname(fullPath).toLowerCase() === ".png" ||
            path.extname(fullPath).toLowerCase() === ".jpg" ||
            path.extname(fullPath).toLowerCase() === ".jpeg") {
            // Если файл является изображением, сжимаем его и сохраняем сжатую версию в отдельный файл
            var imageDir = path.dirname(fullPath);
            var compressedDir = path.join(imageDir, "compressed");
            if (!fs.existsSync(compressedDir)) {
                fs.mkdirSync(compressedDir);
            }
            var compressedPath_1 = path.join(compressedDir, path.basename(fullPath));
            tinify_1.default.fromFile(fullPath).toFile(compressedPath_1, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                var beforeSize = fs.statSync(dir).size;
                var afterSize = fs.statSync(compressedPath_1).size;
                var table = new Table({
                    head: ["File ", "Before", "After"],
                    style: {
                        head: ['green'],
                        border: ['blue'],
                    }
                });
                table.push([
                    "".concat(path.basename(dir)),
                    "".concat(beforeSize, " B"),
                    "".concat(afterSize, " B")
                ]);
                console.log(table.toString());
                console.log("\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 ".concat(fullPath, " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u0436\u0430\u0442\u043E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E \u0432 ").concat(compressedPath_1));
            });
        }
    });
};
// Получаем путь к файлу изображения или папке с изображениями
var inputPath = process.argv[2];
compressImages(inputPath);
