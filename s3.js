const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: "us-east-1",
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
});

// Create an S3 object

const uploadToS3 = async function (bucketName, fileName, folderS3, file) {
  const params = {
    Bucket: bucketName,
    Key: folderS3 + "/" + fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const deleteObjectToS3 = async function (bucketName, s3ObjectUrl) {
  // Set the S3 parameters`${process.env.S3_BUCKET}/`
  console.log(s3ObjectUrl)

  const objectKey = s3ObjectUrl.replace(`https://s3.amazonaws.com/${process.env.S3_BUCKET}/`, "");

  console.log(`objectKey: ${objectKey}`);
  
  const s3Params = {
    Bucket: bucketName,
    Key: objectKey,
  };


  try {
    await s3.deleteObject(s3Params).promise();
    console.log(`Successfully deleted object: ${s3ObjectUrl}`);
  } catch (err) {
    console.log(`Error deleting object: ${s3ObjectUrl}`, err);
  }
};

// Export the upload function
module.exports = { uploadToS3, deleteObjectToS3 };
