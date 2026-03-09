const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadToCloudinary = async (
  file,
  resourceType = "auto",
  folder = "municipality",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: folder,
        max_file_size: 20 * 1024 * 1024, // 20MB
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    // Convert buffer to stream and pipe to Cloudinary
    const buffer = file.buffer || file.data;
    if (!buffer) {
      reject(new Error("No file buffer found"));
      return;
    }
    Readable.from(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (fileUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split(".")[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;

    await cloudinary.uploader.destroy(fullPublicId);
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
