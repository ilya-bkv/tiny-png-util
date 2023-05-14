require('dotenv').config();
var tinify = require("tinify");
var fs = require("fs");
var path = require("path");
var Table = require("cli-table3");
tinify.key = process.env.API_KEY;
var compressImages = function (dir, table) {
    fs.readdirSync(dir).forEach(function (file) {
        var fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            compressImages(fullPath, table);
        }
        else if ([".png", ".jpg", ".jpeg"].includes(path.extname(fullPath).toLowerCase())) {
            var imageDir = path.dirname(fullPath);
            var compressedDir = path.join(imageDir, "compressed");
            if (!fs.existsSync(compressedDir)) {
                fs.mkdirSync(compressedDir);
            }
            var compressedPath_1 = path.join(compressedDir, path.basename(fullPath));
            tinify.fromFile(fullPath).toFile(compressedPath_1, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                var beforeSize = fs.statSync(fullPath).size;
                var afterSize = fs.statSync(compressedPath_1).size;
                var tableData = [
                    [path.basename(fullPath), "".concat(beforeSize, " B"), "".concat(afterSize, " B")],
                ];
                var tableConfig = {
                    head: ["File", "Before", "After"],
                    style: {
                        head: ["green"],
                        border: ["blue"],
                    },
                };
                var outputTable = table ? table : new Table(tableConfig);
                outputTable.push.apply(outputTable, tableData);
                console.log(outputTable.toString());
                console.log("Image ".concat(fullPath, " compressed & saved to ").concat(compressedPath_1));
            });
        }
    });
};
var inputPath = process.argv[2];
var table = new Table({
    head: ["File", "Before", "After"],
    style: {
        head: ["green"],
        border: ["blue"],
    },
});
compressImages(inputPath, table);
