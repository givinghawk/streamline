const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * Analyze bitrate distribution over time
 */
async function analyzeBitrate(filePath, interval = 1) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_packets',
      '-select_streams', 'v:0',
      filePath
    ]);

    let output = '';
    let errorOutput = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`FFprobe failed: ${errorOutput}`));
        return;
      }

      try {
        const data = JSON.parse(output);
        const packets = data.packets || [];
        
        console.log(`[Analysis] Received ${packets.length} packets from ffprobe`);
        
        if (packets.length === 0) {
          reject(new Error('No packet data found in file'));
          return;
        }
        
        // Calculate bitrate per second
        const bitrateData = calculateBitratePerSecond(packets, interval);
        
        console.log(`[Analysis] Calculated ${bitrateData.length} bitrate data points`);
        
        if (bitrateData.length === 0) {
          reject(new Error('Unable to calculate bitrate data'));
          return;
        }
        
        const bitrates = bitrateData.map(p => p.bitrate).filter(b => !isNaN(b) && isFinite(b));
        
        if (bitrates.length === 0) {
          reject(new Error('No valid bitrate values calculated'));
          return;
        }
        
        console.log(`[Analysis] Bitrate range: ${Math.min(...bitrates).toFixed(2)} - ${Math.max(...bitrates).toFixed(2)} kbps`);
        
        resolve({
          data: bitrateData,
          summary: {
            average: bitrates.reduce((sum, b) => sum + b, 0) / bitrates.length,
            peak: Math.max(...bitrates),
            min: Math.min(...bitrates),
          }
        });
      } catch (error) {
        console.error('[Analysis] Error parsing bitrate data:', error);
        reject(error);
      }
    });

    ffprobe.on('error', reject);
  });
}

function calculateBitratePerSecond(packets, interval) {
  const timeGroups = {};
  
  packets.forEach(packet => {
    const time = parseFloat(packet.pts_time || 0);
    const size = parseInt(packet.size || 0);
    const bucket = Math.floor(time / interval) * interval;
    
    if (!timeGroups[bucket]) {
      timeGroups[bucket] = { size: 0, count: 0 };
    }
    
    timeGroups[bucket].size += size;
    timeGroups[bucket].count++;
  });

  return Object.entries(timeGroups)
    .map(([time, data]) => ({
      time: parseFloat(time),
      bitrate: (data.size * 8) / (interval * 1000), // kbps
      packets: data.count
    }))
    .sort((a, b) => a.time - b.time);
}

/**
 * Detect scenes in video
 */
async function detectScenes(filePath, threshold = 0.3) {
  return new Promise((resolve, reject) => {
    const tempFile = path.join(os.tmpdir(), `scenes_${Date.now()}.txt`);
    
    const ffmpeg = spawn('ffmpeg', [
      '-i', filePath,
      '-vf', `select='gt(scene,${threshold})',showinfo`,
      '-f', 'null',
      '-'
    ]);

    let output = '';
    const scenes = [];

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
      
      // Parse showinfo output for frame times
      const matches = data.toString().matchAll(/pts_time:(\d+\.?\d*)/g);
      for (const match of matches) {
        scenes.push({
          time: parseFloat(match[1]),
          timestamp: formatTimestamp(parseFloat(match[1]))
        });
      }
    });

    ffmpeg.on('close', (code) => {
      // Scene detection might fail on some videos, don't reject
      resolve({
        scenes: scenes,
        count: scenes.length,
        threshold: threshold
      });
    });

    ffmpeg.on('error', reject);
  });
}

/**
 * Analyze video content complexity
 */
async function analyzeContent(filePath) {
  return new Promise((resolve, reject) => {
    // Get frame complexity using si (spatial info) and ti (temporal info)
    const ffmpeg = spawn('ffmpeg', [
      '-i', filePath,
      '-vf', 'signalstats',
      '-f', 'null',
      '-'
    ]);

    let output = '';
    const complexityData = [];

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
      
      // Parse signalstats output
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.includes('lavfi.signalstats')) {
          const satMatch = line.match(/SATAVG:\s*(\d+\.?\d*)/);
          if (satMatch) {
            complexityData.push(parseFloat(satMatch[1]));
          }
        }
      });
    });

    ffmpeg.on('close', (code) => {
      const average = complexityData.reduce((sum, val) => sum + val, 0) / complexityData.length || 0;
      const variance = calculateVariance(complexityData);
      
      resolve({
        complexity: average,
        variance: variance,
        grainLevel: estimateGrainLevel(variance),
        recommendation: getComplexityRecommendation(average, variance)
      });
    });

    ffmpeg.on('error', reject);
  });
}

function calculateVariance(data) {
  if (data.length === 0) return 0;
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
}

function estimateGrainLevel(variance) {
  if (variance < 5) return 'Low';
  if (variance < 20) return 'Medium';
  return 'High';
}

function getComplexityRecommendation(complexity, variance) {
  if (complexity > 100 && variance > 20) {
    return 'High complexity - Use higher bitrate, 2-pass encoding recommended';
  } else if (complexity > 50) {
    return 'Medium complexity - Standard settings should work well';
  } else {
    return 'Low complexity - Can use lower bitrate efficiently';
  }
}

/**
 * Calculate quality metrics (PSNR, SSIM, VMAF)
 */
async function analyzeQualityMetrics(originalPath, encodedPath, metric = 'all') {
  const results = {};
  
  if (metric === 'all' || metric === 'psnr') {
    results.psnr = await calculatePSNR(originalPath, encodedPath);
  }
  
  if (metric === 'all' || metric === 'ssim') {
    results.ssim = await calculateSSIM(originalPath, encodedPath);
  }
  
  if (metric === 'all' || metric === 'vmaf') {
    results.vmaf = await calculateVMAF(originalPath, encodedPath);
  }
  
  return results;
}

async function calculatePSNR(ref, dist) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', dist,
      '-i', ref,
      '-lavfi', 'psnr=stats_file=-',
      '-f', 'null',
      '-'
    ]);

    let output = '';
    const frameData = [];

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
      
      const matches = data.toString().matchAll(/psnr_avg:(\d+\.?\d*)/g);
      for (const match of matches) {
        frameData.push(parseFloat(match[1]));
      }
    });

    ffmpeg.on('close', (code) => {
      const average = frameData.reduce((sum, val) => sum + val, 0) / frameData.length || 0;
      
      resolve({
        average: average,
        frames: frameData,
        min: Math.min(...frameData),
        max: Math.max(...frameData)
      });
    });

    ffmpeg.on('error', reject);
  });
}

async function calculateSSIM(ref, dist) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', dist,
      '-i', ref,
      '-lavfi', 'ssim=stats_file=-',
      '-f', 'null',
      '-'
    ]);

    let output = '';
    const frameData = [];

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
      
      const matches = data.toString().matchAll(/All:(\d+\.?\d*)/g);
      for (const match of matches) {
        frameData.push(parseFloat(match[1]));
      }
    });

    ffmpeg.on('close', (code) => {
      const average = frameData.reduce((sum, val) => sum + val, 0) / frameData.length || 0;
      
      resolve({
        average: average,
        frames: frameData,
        min: Math.min(...frameData),
        max: Math.max(...frameData)
      });
    });

    ffmpeg.on('error', reject);
  });
}

async function calculateVMAF(ref, dist) {
  return new Promise((resolve, reject) => {
    // VMAF requires libvmaf filter
    const ffmpeg = spawn('ffmpeg', [
      '-i', dist,
      '-i', ref,
      '-lavfi', 'libvmaf=log_fmt=json:log_path=-',
      '-f', 'null',
      '-'
    ]);

    let output = '';

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.on('close', (code) => {
      // Try to parse VMAF JSON output
      try {
        const vmafMatch = output.match(/VMAF score:\s*(\d+\.?\d*)/);
        if (vmafMatch) {
          resolve({
            average: parseFloat(vmafMatch[1]),
            frames: []
          });
        } else {
          // VMAF might not be available
          resolve({
            average: null,
            error: 'VMAF not available in this FFmpeg build'
          });
        }
      } catch (error) {
        resolve({
          average: null,
          error: 'VMAF analysis failed'
        });
      }
    });

    ffmpeg.on('error', () => {
      resolve({
        average: null,
        error: 'VMAF not supported'
      });
    });
  });
}

function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

module.exports = {
  analyzeBitrate,
  detectScenes,
  analyzeContent,
  analyzeQualityMetrics,
};
