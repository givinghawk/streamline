// ImageMagick integration for single image conversion
const { spawn } = require('child_process');
const path = require('path');

/**
 * Converts a single image to another format using ImageMagick
 * @param {string} inputPath - Absolute path to input image
 * @param {string} outputPath - Absolute path to output image
 * @param {object} options - Conversion options (quality, format, etc.)
 * @returns {Promise<{success: boolean, outputPath: string}>}
 */
async function convertImage(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const args = [inputPath];
    // Add quality option if provided
    if (options.quality) {
      args.push('-quality', String(options.quality));
    }
    // Output format is inferred from outputPath extension
    args.push(outputPath);

    // Use bundled imagemagick binary if available, else fallback to system 'magick'
    const magickCmd = 'magick'; // For now, use system magick
    const proc = spawn(magickCmd, args);

    let errorOutput = '';
    proc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, outputPath });
      } else {
        reject(new Error(`ImageMagick failed with code ${code}\n${errorOutput}`));
      }
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = {
  convertImage,
};
