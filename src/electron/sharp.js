// Sharp integration for single image conversion
const sharp = require('sharp');
const path = require('path');

/**
 * Converts a single image to another format using sharp
 * @param {string} inputPath - Absolute path to input image
 * @param {string} outputPath - Absolute path to output image
 * @param {object} options - Conversion options (quality, format, etc.)
 * @returns {Promise<{success: boolean, outputPath: string}>}
 */
async function convertImage(inputPath, outputPath, options = {}) {
  const ext = path.extname(outputPath).toLowerCase();
  let pipeline = sharp(inputPath);

  if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: options.quality || 80 });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: options.quality || 80 });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: options.quality || 80 });
  } else {
    throw new Error('Unsupported output format: ' + ext);
  }

  await pipeline.toFile(outputPath);
  return { success: true, outputPath };
}

module.exports = {
  convertImage,
};
