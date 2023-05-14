require('dotenv').config();

const tinify = require("tinify");
const fs = require("fs");
const path = require("path");
const Table = require("cli-table3");

tinify.key = process.env.API_KEY;

const compressImages = (dir, table) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      compressImages(fullPath, table);
    } else if (
      [".png", ".jpg", ".jpeg"].includes(path.extname(fullPath).toLowerCase())
    ) {
      const imageDir = path.dirname(fullPath);
      const compressedDir = path.join(imageDir, "compressed");
      if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir);
      }
      const compressedPath = path.join(
        compressedDir,
        path.basename(fullPath)
      );
      tinify.fromFile(fullPath).toFile(compressedPath, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        const beforeSize = fs.statSync(fullPath).size;
        const afterSize = fs.statSync(compressedPath).size;

        const tableData = [
          [path.basename(fullPath), `${beforeSize} B`, `${afterSize} B`],
        ];

        const tableConfig = {
          head: ["File", "Before", "After"],
          style: {
            head: ["green"],
            border: ["blue"],
          },
        };

        const outputTable = table ? table : new Table(tableConfig);
        outputTable.push(...tableData);
        console.log(outputTable.toString());

        console.log(
          `Image ${fullPath} compressed & saved to ${compressedPath}`
        );
      });
    }
  });
};

const inputPath = process.argv[2];
const table = new Table({
  head: ["File", "Before", "After"],
  style: {
    head: ["green"],
    border: ["blue"],
  },
});
compressImages(inputPath, table);
