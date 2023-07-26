const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { putObject, getObjectURL } = require("./s3-client");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadFolder = "tmp/";
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    callback(null, uploadFolder);
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.json({
    success: true,
    data: {
      message: "Todo chevere",
    },
  });
});

app.post("/upload-avatar", upload.single("file"), async (req, res) => {
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
});

app.get("/file", async (req, res) => {
  const { key } = req.body;
  if (key) {
    const url = await getObjectURL(key);
    res.send(url);
  } else {
    res
      .json({
        success: false,
        message: "key is required field",
      })
      .status(400);
  }
});

// app.put("/update-avatar", async (req, res) => {
//   const { putUrl, file } = req.body;
//   if (!putUrl || !file) {
//     return res
//       .json({
//         success: false,
//         message: "putUrl and file are required fields",
//       })
//       .status(400);
//   }

//   const { data } = await axios.put(putUrl, file, {
//     headers: {
//       "Content-Type": "application/octet-stream",
//     },
//   });

//   console.log(data);

//   return res.json({
//     success: true,
//     data,
//   });
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
