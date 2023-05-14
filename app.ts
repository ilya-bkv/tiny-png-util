import tinify from "tinify"
import * as fs from 'fs'
import * as path from 'path'
import * as Table from "cli-table3"

tinify.key = "KEY";

const compressImages = (dir: string, table?: Table) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      compressImages(fullPath, table);
    } else if (
      path.extname(fullPath).toLowerCase() === ".png" ||
      path.extname(fullPath).toLowerCase() === ".jpg" ||
      path.extname(fullPath).toLowerCase() === ".jpeg"
    ) {
      const imageDir = path.dirname(fullPath);
      const compressedDir = path.join(imageDir, "compressed");
      if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir);
      }
      const compressedPath = path.join(compressedDir, path.basename(fullPath));
      tinify.fromFile(fullPath).toFile(compressedPath, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        const beforeSize = fs.statSync(dir).size;
        const afterSize = fs.statSync(compressedPath).size;

        const table = new Table({
          head: ["File ", "Before", "After"],
          style: {
            head: ['green'],
            border: ['blue'],
          }
        })

        table.push([
          `${path.basename(dir)}`,
          `${beforeSize} B`,
          `${afterSize} B`
        ]);
        console.log(table.toString());

        console.log(`Изображение ${fullPath} успешно сжато и сохранено в ${compressedPath}`);
      });
    }
  });
}

const inputPath = process.argv[2];
compressImages(inputPath)
