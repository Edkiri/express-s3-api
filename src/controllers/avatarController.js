const path = require("path");
const fs = require("fs");

const { putObject } = require("../s3-client");

const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }
  let { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required field" });
  }
  username = username.split(" ").join("-");

  try {
    const pathTempFile = req.file.path;
    const fileExtension = path.extname(pathTempFile);
    const key = `users-avatar/${username}${fileExtension}`;

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

module.exports = { uploadAvatar };
