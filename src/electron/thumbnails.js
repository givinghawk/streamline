const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * Generate a grid of thumbnails from a video file
 * @param {string} inputPath - Path to the video file
 * @param {object} options - Options for thumbnail generation
 * @returns {Promise<string>} - Path to the generated thumbnail grid image
 */
async function generateThumbnailGrid(inputPath, options = {}) {
  const {
    rows = 3,
    cols = 4,
    width = 1920,
    height = 1080,
  } = options;

  const totalThumbs = rows * cols;

  try {
    // Get video duration first
    const duration = await getVideoDuration(inputPath);
    if (!duration || duration <= 0) {
      throw new Error('Could not determine video duration');
    }

    // Create temp directory for individual thumbnails
    const tempDir = path.join(os.tmpdir(), `ffmpeg-thumbs-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Calculate intervals for thumbnail extraction
    const interval = duration / (totalThumbs + 1); // +1 to avoid first/last frame
    const timestamps = [];
    for (let i = 1; i <= totalThumbs; i++) {
      timestamps.push(interval * i);
    }

    // Extract individual thumbnails
    console.log(`Extracting ${totalThumbs} thumbnails from video...`);
    await extractThumbnails(inputPath, timestamps, tempDir);

    // Verify thumbnails were created
    const thumbFiles = await fs.readdir(tempDir);
    console.log(`Created ${thumbFiles.length} thumbnail files:`, thumbFiles);
    
    if (thumbFiles.length === 0) {
      throw new Error('No thumbnails were created');
    }

    // Create output path in temp directory
    const outputPath = path.join(tempDir, 'thumbnail-grid.jpg');

    // Create the grid using FFmpeg's tile filter
    await createThumbnailGrid(tempDir, outputPath, rows, cols, totalThumbs);

    // Clean up individual thumbnails (keep only the grid)
    const files = await fs.readdir(tempDir);
    for (const file of files) {
      if (file !== 'thumbnail-grid.jpg') {
        await fs.unlink(path.join(tempDir, file)).catch(() => {});
      }
    }

    console.log('Thumbnail grid created:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error generating thumbnail grid:', error);
    throw error;
  }
}

/**
 * Get video duration in seconds
 */
function getVideoDuration(inputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputPath
    ];

    const ffprobe = spawn('ffprobe', args);
    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(output.trim());
        resolve(duration);
      } else {
        reject(new Error('Failed to get video duration'));
      }
    });

    ffprobe.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Extract individual thumbnails at specified timestamps
 */
async function extractThumbnails(inputPath, timestamps, outputDir) {
  // Extract thumbnails one at a time for reliability
  for (let i = 0; i < timestamps.length; i++) {
    const timestamp = timestamps[i];
    const outputPath = path.join(outputDir, `thumb${String(i).padStart(3, '0')}.jpg`);
    
    await extractSingleThumbnail(inputPath, timestamp, outputPath);
  }
}

/**
 * Extract a single thumbnail at a specific timestamp
 */
function extractSingleThumbnail(inputPath, timestamp, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-ss', timestamp.toString(),
      '-i', inputPath,
      '-vframes', '1',
      '-vf', 'scale=480:270',
      '-q:v', '2',
      '-y',
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', args);
    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg failed to extract thumbnail: ${errorOutput}`));
      }
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Create thumbnail grid from individual images
 */
function createThumbnailGrid(inputDir, outputPath, rows, cols, totalThumbs) {
  return new Promise((resolve, reject) => {
    // Build input list
    const inputs = [];
    for (let i = 0; i < totalThumbs; i++) {
      inputs.push('-i', path.join(inputDir, `thumb${String(i).padStart(3, '0')}.jpg`));
    }

    // Build filter for tiling
    const filterInputs = Array.from({ length: totalThumbs }, (_, i) => `[${i}:v]`).join('');
    const tileFilter = `${filterInputs}xstack=inputs=${totalThumbs}:layout=${generateLayout(rows, cols)}[v]`;

    const args = [
      ...inputs,
      '-filter_complex', tileFilter,
      '-map', '[v]',
      '-q:v', '2', // High quality JPEG
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', args);
    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg grid creation failed: ${errorOutput}`));
      }
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Generate xstack layout string for grid
 */
function generateLayout(rows, cols) {
  const layout = [];
  const thumbWidth = 480;
  const thumbHeight = 270;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * thumbWidth;
      const y = row * thumbHeight;
      layout.push(`${x}_${y}`);
    }
  }

  return layout.join('|');
}

/**
 * Clean up thumbnail directory
 */
async function cleanupThumbnails(thumbnailPath) {
  try {
    const dir = path.dirname(thumbnailPath);
    if (dir.includes('ffmpeg-thumbs-')) {
      await fs.rm(dir, { recursive: true, force: true });
      console.log('Cleaned up thumbnail directory');
    }
  } catch (error) {
    console.error('Error cleaning up thumbnails:', error);
  }
}

module.exports = {
  generateThumbnailGrid,
  cleanupThumbnails,
};
