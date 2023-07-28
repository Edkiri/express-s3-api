const fs = require("fs");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();

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

async function putObject(pathFile, key) {
  const stream = fs.createReadStream(pathFile);

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: stream,
  });
  await client.send(command);
  return key;
}

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  return url;
}

module.exports = { putObject, getObjectUrl };
