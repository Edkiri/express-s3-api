# Media REST API

AWS S3 Image Upload and Retrieval API

## Endpoints

* POST /upload: This endpoint allows users to upload an image to the specified AWS S3 bucket.
  Request Parameters:
    image: The binary data of the image to be uploaded.
    filename: The desired filename for the uploaded image.
  Response: Returns a JSON object with the URL of the uploaded image or error message.

* POST /file/: This endpoint retrieves the specified image from the AWS S3 bucket.
  Request Parameter:
    filename: The name of the image to be retrieved.
  Response: Returns the s3 url of the image or error message.

## Environment Variables:
* AWS_BUCKET_NAME: The name of the AWS S3 bucket where the images will be stored.
* AWS_BUCKET_REGION: The AWS region where the S3 bucket is located.
* AWS_PUBLIC_KEY: The public access key for the AWS account used to access the S3 bucket.
* AWS_SECRET_KEY: The secret access key for the AWS account used to access the S3 bucket.