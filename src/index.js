const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { putObject, getObjectURL } = require("./s3-client");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    data: {
      message: "Todo chevere",
    },
  });
});

const port = 5000;

app.post("/upload", async (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.json({
      success: false,
      message: "key is required field",
    });
  }
  try {
    const putUrl = await putObject(key);
    res.json({
      success: true,
      data: {
        putUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .json({
        success: false,
        message: "error uploading file",
      })
      .status(500);
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

app.listen(port, () => {
  console.log("Server listening at http://localhost:5000");
});
