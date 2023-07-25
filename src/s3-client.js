require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

async function putObject(filename) {
  const fileExtension = filename.split(".").pop().toLowerCase();

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
    ContentType: fileExtension,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 20 });
  return url;
}

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 20 });
  return {
    success: true,
    data: {
      url,
    },
  };
}

module.exports = { putObject, getObjectURL };
