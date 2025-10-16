const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * Checks if FFmpeg and FFprobe are available in the system PATH
 */
async function checkFFmpegPresence() {
  return new Promise((resolve) => {
    const checks = {
      ffmpeg: false,
      ffprobe: false,
      ffmpegVersion: null,
      ffprobeVersion: null,
    };

    // Check FFmpeg
    const ffmpegCheck = spawn('ffmpeg', ['-version']);
    let ffmpegOutput = '';

    ffmpegCheck.stdout.on('data', (data) => {
      ffmpegOutput += data.toString();
    });

    ffmpegCheck.on('close', (code) => {
      if (code === 0) {
        checks.ffmpeg = true;
        const versionMatch = ffmpegOutput.match(/ffmpeg version ([^\s]+)/);
        if (versionMatch) {
          checks.ffmpegVersion = versionMatch[1];
        }
      }

      // Check FFprobe
      const ffprobeCheck = spawn('ffprobe', ['-version']);
      let ffprobeOutput = '';

      ffprobeCheck.stdout.on('data', (data) => {
        ffprobeOutput += data.toString();
      });

      ffprobeCheck.on('close', (code) => {
        if (code === 0) {
          checks.ffprobe = true;
          const versionMatch = ffprobeOutput.match(/ffprobe version ([^\s]+)/);
          if (versionMatch) {
            checks.ffprobeVersion = versionMatch[1];
          }
        }

        resolve(checks);
      });

      ffprobeCheck.on('error', () => {
        resolve(checks);
      });
    });

    ffmpegCheck.on('error', () => {
      // FFmpeg not found, still check FFprobe
      const ffprobeCheck = spawn('ffprobe', ['-version']);
      let ffprobeOutput = '';

      ffprobeCheck.stdout.on('data', (data) => {
        ffprobeOutput += data.toString();
      });

      ffprobeCheck.on('close', (code) => {
        if (code === 0) {
          checks.ffprobe = true;
          const versionMatch = ffprobeOutput.match(/ffprobe version ([^\s]+)/);
          if (versionMatch) {
            checks.ffprobeVersion = versionMatch[1];
          }
        }

        resolve(checks);
      });

      ffprobeCheck.on('error', () => {
        resolve(checks);
      });
    });
  });
}

/**
 * Detects available hardware acceleration encoders
 * This checks both if FFmpeg has the encoder AND if it can actually initialize
 */
async function checkHardwareSupport() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-hide_banner', '-encoders']);
    let output = '';

    ffmpeg.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.on('close', async () => {
      // First check what encoders are compiled in
      const compiledSupport = {
        nvidia: {
          h264: output.includes('h264_nvenc'),
          hevc: output.includes('hevc_nvenc'),
          av1: output.includes('av1_nvenc'),
        },
        amd: {
          h264: output.includes('h264_amf'),
          hevc: output.includes('hevc_amf'),
          av1: output.includes('av1_amf'),
        },
        intel: {
          h264: output.includes('h264_qsv'),
          hevc: output.includes('hevc_qsv'),
          av1: output.includes('av1_qsv'),
        },
        apple: {
          h264: output.includes('h264_videotoolbox'),
          hevc: output.includes('hevc_videotoolbox'),
        },
        vulkan: {
          h264: output.includes('h264_vulkan'),
          hevc: output.includes('hevc_vulkan'),
        },
      };

      // Now test if they actually work
      const testedSupport = await testHardwareEncoders(compiledSupport);
      resolve(testedSupport);
    });

    ffmpeg.on('error', () => {
      resolve({
        nvidia: { h264: false, hevc: false, av1: false },
        amd: { h264: false, hevc: false, av1: false },
        intel: { h264: false, hevc: false, av1: false },
        apple: { h264: false, hevc: false },
        vulkan: { h264: false, hevc: false },
      });
    });
  });
}

/**
 * Tests if hardware encoders can actually be initialized
 */
async function testHardwareEncoders(compiledSupport) {
  const tested = {
    nvidia: { h264: false, hevc: false, av1: false },
    amd: { h264: false, hevc: false, av1: false },
    intel: { h264: false, hevc: false, av1: false },
    apple: { h264: false, hevc: false },
    vulkan: { h264: false, hevc: false },
  };

  // Test NVIDIA
  if (compiledSupport.nvidia.h264) {
    tested.nvidia.h264 = await testEncoder('h264_nvenc');
  }
  if (compiledSupport.nvidia.hevc) {
    tested.nvidia.hevc = await testEncoder('hevc_nvenc');
  }

  // Test AMD
  if (compiledSupport.amd.h264) {
    tested.amd.h264 = await testEncoder('h264_amf');
  }
  if (compiledSupport.amd.hevc) {
    tested.amd.hevc = await testEncoder('hevc_amf');
  }

  // Test Intel (only if NVIDIA and AMD both failed, since false positives are common)
  const hasNvidiaOrAmd = tested.nvidia.h264 || tested.nvidia.hevc || tested.amd.h264 || tested.amd.hevc;
  if (!hasNvidiaOrAmd && compiledSupport.intel.h264) {
    tested.intel.h264 = await testEncoder('h264_qsv');
  }
  if (!hasNvidiaOrAmd && compiledSupport.intel.hevc) {
    tested.intel.hevc = await testEncoder('hevc_qsv');
  }

  // Test Apple
  if (compiledSupport.apple.h264) {
    tested.apple.h264 = await testEncoder('h264_videotoolbox');
  }
  if (compiledSupport.apple.hevc) {
    tested.apple.hevc = await testEncoder('hevc_videotoolbox');
  }

  return tested;
}

/**
 * Tests if a specific encoder can be initialized
 */
function testEncoder(encoderName) {
  return new Promise((resolve) => {
    // Create a simple test: try to initialize the encoder with a null output
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'lavfi',
      '-i', 'nullsrc=s=256x256:d=1',
      '-c:v', encoderName,
      '-frames:v', '1',
      '-f', 'null',
      '-'
    ]);

    let stderr = '';

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      // If it completes successfully or even starts encoding, the encoder works
      // Common error messages that indicate the encoder is NOT available:
      const notAvailable = stderr.includes('Cannot load') ||
                          stderr.includes('No device available') ||
                          stderr.includes('not found') ||
                          stderr.includes('Failed to') ||
                          stderr.includes('cannot open') ||
                          stderr.includes('No such') ||
                          code === 1;
      
      resolve(!notAvailable && code !== 1);
    });

    ffmpeg.on('error', () => {
      resolve(false);
    });

    // Timeout after 3 seconds
    setTimeout(() => {
      ffmpeg.kill();
      resolve(false);
    }, 3000);
  });
}

/**
 * Gets detailed file information using ffprobe
 */
async function getFileInfo(filePath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-show_chapters',
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
        const info = parseProbeData(data, filePath);
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });

    ffprobe.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Parses ffprobe data into human-readable format
 */
function parseProbeData(data, filePath) {
  const { format, streams } = data;
  
  // Check if this is an image file
  const ext = path.extname(filePath).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.heic', '.heif', '.avif'];
  const isImage = imageExtensions.includes(ext);
  
  const videoStreams = streams.filter(s => s.codec_type === 'video');
  const audioStreams = streams.filter(s => s.codec_type === 'audio');
  const subtitleStreams = streams.filter(s => s.codec_type === 'subtitle');

  // For images, don't return video stream info (images appear as single-frame video to ffprobe)
  const info = {
    filePath,
    fileName: path.basename(filePath),
    format: {
      container: format.format_long_name,
      duration: isImage ? 0 : parseFloat(format.duration),
      durationFormatted: isImage ? 'N/A' : formatDuration(parseFloat(format.duration)),
      size: parseInt(format.size),
      sizeFormatted: formatBytes(parseInt(format.size)),
      bitrate: isImage ? 0 : parseInt(format.bit_rate),
      bitrateFormatted: isImage ? 'N/A' : formatBitrate(parseInt(format.bit_rate)),
    },
    video: isImage ? [] : videoStreams.map(v => ({
      index: v.index,
      codec: v.codec_long_name,
      codecShort: v.codec_name,
      profile: v.profile,
      width: v.width,
      height: v.height,
      resolution: `${v.width}x${v.height}`,
      aspectRatio: v.display_aspect_ratio,
      pixelFormat: v.pix_fmt,
      colorSpace: v.color_space,
      colorTransfer: v.color_transfer,
      colorPrimaries: v.color_primaries,
      colorRange: v.color_range,
      chromaLocation: v.chroma_location,
      bitDepth: v.bits_per_raw_sample || 8,
      fps: eval(v.r_frame_rate) || 0,
      fpsFormatted: v.r_frame_rate,
      avgFps: eval(v.avg_frame_rate) || 0,
      bitrate: v.bit_rate ? parseInt(v.bit_rate) : null,
      bitrateFormatted: v.bit_rate ? formatBitrate(parseInt(v.bit_rate)) : 'N/A',
      hdr: detectHDR(v),
      frameCount: v.nb_frames,
      sideData: parseSideData(v.side_data_list),
    })),
    audio: audioStreams.map(a => ({
      index: a.index,
      codec: a.codec_long_name,
      codecShort: a.codec_name,
      profile: a.profile,
      sampleRate: a.sample_rate,
      sampleRateFormatted: `${a.sample_rate} Hz`,
      channels: a.channels,
      channelLayout: a.channel_layout,
      bitrate: a.bit_rate ? parseInt(a.bit_rate) : null,
      bitrateFormatted: a.bit_rate ? formatBitrate(parseInt(a.bit_rate)) : 'N/A',
      bitDepth: a.bits_per_sample,
      language: a.tags?.language || 'Unknown',
      title: a.tags?.title || '',
    })),
    subtitles: subtitleStreams.map(s => ({
      index: s.index,
      codec: s.codec_long_name,
      codecShort: s.codec_name,
      language: s.tags?.language || 'Unknown',
      title: s.tags?.title || '',
    })),
    metadata: format.tags || {},
  };

  return info;
}

/**
 * Detects HDR information from video stream
 */
function detectHDR(videoStream) {
  const hdrInfo = {
    isHDR: false,
    type: 'SDR',
    details: {},
  };

  // Check for HDR10
  if (videoStream.color_transfer === 'smpte2084' || videoStream.color_transfer === 'arib-std-b67') {
    hdrInfo.isHDR = true;
    hdrInfo.type = videoStream.color_transfer === 'smpte2084' ? 'HDR10' : 'HLG';
  }

  // Check for Dolby Vision
  if (videoStream.side_data_list) {
    const hasDolbyVision = videoStream.side_data_list.some(
      sd => sd.side_data_type === 'DOVI configuration record'
    );
    if (hasDolbyVision) {
      hdrInfo.isHDR = true;
      hdrInfo.type = 'Dolby Vision';
    }
  }

  // Check for HDR10+
  if (videoStream.side_data_list) {
    const hasHDR10Plus = videoStream.side_data_list.some(
      sd => sd.side_data_type === 'HDR10+ dynamic metadata'
    );
    if (hasHDR10Plus) {
      hdrInfo.isHDR = true;
      hdrInfo.type = 'HDR10+';
    }
  }

  hdrInfo.details = {
    colorSpace: videoStream.color_space,
    colorTransfer: videoStream.color_transfer,
    colorPrimaries: videoStream.color_primaries,
    colorRange: videoStream.color_range,
    bitDepth: videoStream.bits_per_raw_sample || 8,
  };

  return hdrInfo;
}

/**
 * Parses side data from streams
 */
function parseSideData(sideDataList) {
  if (!sideDataList) return [];
  
  return sideDataList.map(sd => ({
    type: sd.side_data_type,
    data: sd,
  }));
}

/**
 * Formats bytes to human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formats bitrate to human-readable format
 */
function formatBitrate(bitrate) {
  if (!bitrate || bitrate === 0) return 'N/A';
  const kbps = bitrate / 1000;
  if (kbps < 1000) {
    return Math.round(kbps) + ' kbps';
  }
  return Math.round((kbps / 1000) * 10) / 10 + ' Mbps';
}

/**
 * Formats duration to human-readable format
 */
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Encodes a file with the given options
 */
async function encodeFile(options, progressCallback) {
  const {
    inputPath,
    outputPath,
    preset,
    customSettings,
    hardwareAccel,
  } = options;

  // Build FFmpeg command
  const args = await buildFFmpegCommand(inputPath, outputPath, preset, customSettings, hardwareAccel);

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    
    let duration = 0;
    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      const output = data.toString();
      errorOutput += output;

      // Parse duration
      const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}.\d{2})/);
      if (durationMatch) {
        const [_, h, m, s] = durationMatch;
        duration = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
      }

      // Parse progress
      const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2}.\d{2})/);
      if (timeMatch && duration > 0) {
        const [_, h, m, s] = timeMatch;
        const currentTime = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
        const progress = (currentTime / duration) * 100;
        
        // Extract additional info
        const fpsMatch = output.match(/fps=\s*(\d+\.?\d*)/);
        const speedMatch = output.match(/speed=\s*(\d+\.?\d*)x/);
        const bitrateMatch = output.match(/bitrate=\s*(\d+\.?\d*)(.*?)bits\/s/);

        progressCallback({
          progress: Math.min(progress, 100),
          currentTime,
          duration,
          fps: fpsMatch ? parseFloat(fpsMatch[1]) : 0,
          speed: speedMatch ? parseFloat(speedMatch[1]) : 0,
          bitrate: bitrateMatch ? `${bitrateMatch[1]}${bitrateMatch[2]}bits/s` : 'N/A',
        });
      }
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          outputPath,
        });
      } else {
        reject(new Error(`FFmpeg encoding failed with code ${code}\n${errorOutput}`));
      }
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Builds FFmpeg command based on preset and settings
 */
async function buildFFmpegCommand(inputPath, outputPath, preset, customSettings, hardwareAccel) {
  const args = ['-i', inputPath];

  // Add hardware acceleration if available
  if (hardwareAccel && hardwareAccel.enabled) {
    if (hardwareAccel.type === 'nvidia') {
      args.unshift('-hwaccel', 'cuda');
      args.unshift('-hwaccel_output_format', 'cuda');
    } else if (hardwareAccel.type === 'amd') {
      args.unshift('-hwaccel', 'd3d11va');
    } else if (hardwareAccel.type === 'intel') {
      args.unshift('-hwaccel', 'qsv');
    } else if (hardwareAccel.type === 'apple') {
      args.unshift('-hwaccel', 'videotoolbox');
    }
  }

  // Apply preset settings
  if (customSettings && Object.keys(customSettings).length > 0) {
    // Use custom settings
    applyCustomSettings(args, customSettings, hardwareAccel);
  } else {
    // Use preset
    applyPreset(args, preset, hardwareAccel);
  }

  // Output file
  args.push('-y'); // Overwrite output file
  args.push(outputPath);

  return args;
}

/**
 * Applies preset settings to FFmpeg command
 */
function applyPreset(args, preset, hardwareAccel) {
  const presets = {
    'high-quality': {
      video: { codec: 'libx264', crf: 18, preset: 'slow' },
      audio: { codec: 'aac', bitrate: '256k' },
    },
    'balanced': {
      video: { codec: 'libx264', crf: 23, preset: 'medium' },
      audio: { codec: 'aac', bitrate: '192k' },
    },
    'fast': {
      video: { codec: 'libx264', crf: 28, preset: 'faster' },
      audio: { codec: 'aac', bitrate: '128k' },
    },
    'hevc-high': {
      video: { codec: 'libx265', crf: 20, preset: 'slow' },
      audio: { codec: 'aac', bitrate: '256k' },
    },
    'hevc-balanced': {
      video: { codec: 'libx265', crf: 24, preset: 'medium' },
      audio: { codec: 'aac', bitrate: '192k' },
    },
    'av1-high': {
      video: { codec: 'libaom-av1', crf: 25, cpuUsed: 4 },
      audio: { codec: 'opus', bitrate: '192k' },
    },
    'image-optimization': {
      quality: 85,
    },
    'audio-only': {
      audio: { codec: 'aac', bitrate: '320k' },
    },
  };

  const settings = presets[preset.id] || presets['balanced'];

  // Apply video settings
  if (settings.video) {
    let codec = settings.video.codec;
    
    // Use hardware encoder if available
    if (hardwareAccel && hardwareAccel.enabled) {
      if (hardwareAccel.type === 'nvidia') {
        if (codec === 'libx264') codec = 'h264_nvenc';
        else if (codec === 'libx265') codec = 'hevc_nvenc';
        else if (codec === 'libaom-av1') codec = 'av1_nvenc';
      } else if (hardwareAccel.type === 'amd') {
        if (codec === 'libx264') codec = 'h264_amf';
        else if (codec === 'libx265') codec = 'hevc_amf';
      } else if (hardwareAccel.type === 'intel') {
        if (codec === 'libx264') codec = 'h264_qsv';
        else if (codec === 'libx265') codec = 'hevc_qsv';
      } else if (hardwareAccel.type === 'apple') {
        if (codec === 'libx264') codec = 'h264_videotoolbox';
        else if (codec === 'libx265') codec = 'hevc_videotoolbox';
      }
    }

    args.push('-c:v', codec);
    
    if (settings.video.crf) {
      args.push('-crf', settings.video.crf.toString());
    }
    if (settings.video.preset && codec.startsWith('lib')) {
      args.push('-preset', settings.video.preset);
    }
    if (settings.video.cpuUsed) {
      args.push('-cpu-used', settings.video.cpuUsed.toString());
    }
  }

  // Apply audio settings
  if (settings.audio) {
    args.push('-c:a', settings.audio.codec);
    if (settings.audio.bitrate) {
      args.push('-b:a', settings.audio.bitrate);
    }
  }
}

/**
 * Applies custom settings to FFmpeg command
 */
function applyCustomSettings(args, settings, hardwareAccel) {
  // Video codec
  if (settings.videoCodec) {
    let codec = settings.videoCodec;
    
    // Apply hardware acceleration
    if (hardwareAccel && hardwareAccel.enabled && settings.useHardwareAccel) {
      codec = getHardwareEncoder(codec, hardwareAccel.type);
    }
    
    args.push('-c:v', codec);
  }

  // Video bitrate or CRF
  if (settings.videoBitrate) {
    args.push('-b:v', settings.videoBitrate);
  } else if (settings.crf) {
    args.push('-crf', settings.crf.toString());
  }

  // Video preset
  if (settings.preset) {
    args.push('-preset', settings.preset);
  }

  // Resolution
  if (settings.resolution) {
    args.push('-vf', `scale=${settings.resolution}`);
  }

  // Frame rate
  if (settings.fps) {
    args.push('-r', settings.fps.toString());
  }

  // Audio codec
  if (settings.audioCodec) {
    args.push('-c:a', settings.audioCodec);
  }

  // Audio bitrate
  if (settings.audioBitrate) {
    args.push('-b:a', settings.audioBitrate);
  }

  // Audio sample rate
  if (settings.audioSampleRate) {
    args.push('-ar', settings.audioSampleRate.toString());
  }

  // Audio channels
  if (settings.audioChannels) {
    args.push('-ac', settings.audioChannels.toString());
  }

  // Additional arguments
  if (settings.additionalArgs) {
    args.push(...settings.additionalArgs.split(' '));
  }
}

/**
 * Gets hardware encoder name for a given software encoder
 */
function getHardwareEncoder(softwareCodec, hardwareType) {
  const mapping = {
    nvidia: {
      libx264: 'h264_nvenc',
      libx265: 'hevc_nvenc',
      'libaom-av1': 'av1_nvenc',
    },
    amd: {
      libx264: 'h264_amf',
      libx265: 'hevc_amf',
    },
    intel: {
      libx264: 'h264_qsv',
      libx265: 'hevc_qsv',
    },
    apple: {
      libx264: 'h264_videotoolbox',
      libx265: 'hevc_videotoolbox',
    },
  };

  return mapping[hardwareType]?.[softwareCodec] || softwareCodec;
}

/**
 * Analyze quality metrics comparing original and encoded files
 * Uses FFmpeg's PSNR, SSIM, and VMAF filters
 */
async function analyzeQuality(originalPath, encodedPath) {
  return new Promise((resolve, reject) => {
    const metrics = {};
    let stderr = '';

    // Run PSNR analysis
    const psnrProcess = spawn('ffmpeg', [
      '-i', originalPath,
      '-i', encodedPath,
      '-lavfi', 'psnr',
      '-f', 'null',
      '-'
    ]);

    psnrProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    psnrProcess.on('close', (code) => {
      // Parse PSNR from stderr
      const psnrMatch = stderr.match(/PSNR.*average:(\d+\.\d+)/);
      if (psnrMatch) {
        metrics.psnr = parseFloat(psnrMatch[1]).toFixed(2);
      }

      // Run SSIM analysis
      stderr = '';
      const ssimProcess = spawn('ffmpeg', [
        '-i', originalPath,
        '-i', encodedPath,
        '-lavfi', 'ssim',
        '-f', 'null',
        '-'
      ]);

      ssimProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ssimProcess.on('close', (code) => {
        // Parse SSIM from stderr
        const ssimMatch = stderr.match(/SSIM.*All:(\d+\.\d+)/);
        if (ssimMatch) {
          metrics.ssim = parseFloat(ssimMatch[1]).toFixed(4);
        }

        // Try VMAF if available (requires libvmaf)
        stderr = '';
        const vmafProcess = spawn('ffmpeg', [
          '-i', originalPath,
          '-i', encodedPath,
          '-lavfi', 'libvmaf',
          '-f', 'null',
          '-'
        ]);

        vmafProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        vmafProcess.on('close', (code) => {
          // Parse VMAF from stderr
          const vmafMatch = stderr.match(/VMAF score:\s*(\d+\.\d+)/);
          if (vmafMatch) {
            metrics.vmaf = parseFloat(vmafMatch[1]).toFixed(2);
          }

          resolve(metrics);
        });

        vmafProcess.on('error', () => {
          // VMAF not available, that's okay
          resolve(metrics);
        });
      });

      ssimProcess.on('error', (error) => {
        console.error('SSIM analysis failed:', error);
        resolve(metrics);
      });
    });

    psnrProcess.on('error', (error) => {
      console.error('PSNR analysis failed:', error);
      reject(error);
    });
  });
}

module.exports = {
  checkFFmpegPresence,
  checkHardwareSupport,
  getFileInfo,
  encodeFile,
  analyzeQuality,
};
