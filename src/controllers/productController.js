const path = require("path");
const fs = require("fs");

const { putObject } = require("../s3-client");

const uploadProductImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }
  let { productName } = req.body;
  if (!productName) {
    return res.status(400).json({ message: "productName is required field" });
  }
  productName = productName.split(" ").join("-");

  try {
    const pathTempFile = req.file.path;
    const fileExtension = path.extname(pathTempFile);
    const key = `products-image/${productName}${fileExtension}`;

    await putObject(pathTempFile, key);

    fs.unlink(pathTempFile, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      } else {
        console.log("File deleted from the local disk");
      }
    });

    res.status(200).json({
      success: true,
      message: "file successfully uploaded",
      data: {
        s3ObjectKey: key,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error uploading file",
    });
  }
};

module.exports = { uploadProductImage };
