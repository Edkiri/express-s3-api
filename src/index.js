const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");


const { getObjectURL } = require("./s3-client");
const { uploadAvatar } = require("./controllers/avatarController");

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

app.get("/file", async (req, res) => {
  const { key } = req.body;
  if (key) {
    const url = await getObjectURL(key);
    res.send(url);
  } else {
    res.status(400).json({
      success: false,
      message: "key is required field",
    });
  }
});

app.post("/upload-avatar", upload.single("file"), uploadAvatar);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
