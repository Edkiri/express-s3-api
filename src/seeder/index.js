const dataArray = require("./products.json");
const fs = require("fs");
const path = require("path");
const { putObject } = require("../s3-client");

function seed() {
  try {
    dataArray.forEach((productData) => {
      const { fileName } = productData;
      const filePath = path.resolve("src/seeder/images/", fileName);
      fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
        } else {
          const key = `products-image/${fileName}`;
          await putObject(filePath, key);
          console.log("uploaded: ", key);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

seed();
