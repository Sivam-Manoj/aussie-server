import AWS from "aws-sdk";

// Configure the R2 (S3-compatible) client
const s3 = new AWS.S3({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  endpoint: process.env.R2_ENDPOINT!,
  s3ForcePathStyle: true, // Required for Cloudflare R2 compatibility
  signatureVersion: "v4",
});

/**
 * Function to upload a file to Cloudflare R2.
 * @param file The file to be uploaded (from multer)
 * @param bucketName The R2 bucket name
 * @returns A promise with the uploaded file's URL.
 */
export const uploadToR2 = async (
  file: Express.Multer.File,
  bucketName: string,
  fileName: string
): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: fileName, // Unique file name with timestamp
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Optional: to allow public access
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded file
  } catch (error: any) {
    throw new Error(`Error uploading to R2: ${error.message}`);
  }
};
