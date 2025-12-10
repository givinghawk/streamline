import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

// Icons
const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

function PresetWizard({ preset = null, onSave, onClose }) {
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    name: preset?.name || '',
    description: preset?.description || '',
    category: preset?.category || 'video',
    
    // Video Settings - Basic
    videoCodec: preset?.settings?.videoCodec || 'libx264',
    hwAccel: preset?.settings?.hwAccel || 'none',
    crf: preset?.settings?.crf || '23',
    preset: preset?.settings?.preset || 'medium',
    
    // Video Settings - Advanced
    pixelFormat: preset?.settings?.pixelFormat || '',
    profile: preset?.settings?.profile || '',
    level: preset?.settings?.level || '',
    tune: preset?.settings?.tune || '',
    videoBitrate: preset?.settings?.videoBitrate || '',
    maxBitrate: preset?.settings?.maxBitrate || '',
    bufferSize: preset?.settings?.bufferSize || '',
    gopSize: preset?.settings?.gopSize || '',
    bframes: preset?.settings?.bframes || '',
    
    // Resolution & Frame Rate
    resolution: preset?.settings?.resolution || '',
    width: preset?.settings?.width || '',
    height: preset?.settings?.height || '',
    fps: preset?.settings?.fps || '',
    fpsMode: preset?.settings?.fpsMode || '',
    
    // Audio Settings - Basic
    audioCodec: preset?.settings?.audioCodec || 'aac',
    audioBitrate: preset?.settings?.audioBitrate || '192k',
    audioChannels: preset?.settings?.audioChannels || '2',
    
    // Audio Settings - Advanced
    audioSampleRate: preset?.settings?.audioSampleRate || '48000',
    audioQuality: preset?.settings?.audioQuality || '',
    audioProfile: preset?.settings?.audioProfile || '',
    
    // HDR & Color
    colorSpace: preset?.settings?.colorSpace || '',
    colorPrimaries: preset?.settings?.colorPrimaries || '',
    colorTransfer: preset?.settings?.colorTransfer || '',
    colorRange: preset?.settings?.colorRange || '',
    hdrMetadata: preset?.settings?.hdrMetadata || false,
    
    // Filters
    videoFilters: preset?.settings?.videoFilters || '',
    audioFilters: preset?.settings?.audioFilters || '',
    deinterlace: preset?.settings?.deinterlace || false,
    denoise: preset?.settings?.denoise || '',
    
    // Container & Metadata
    outputFormat: preset?.settings?.outputFormat || 'mp4',
    fastStart: preset?.settings?.fastStart || true,
    copyMetadata: preset?.settings?.copyMetadata || true,
    
    // Subtitles
    copySubtitles: preset?.settings?.copySubtitles || false,
    burnSubtitles: preset?.settings?.burnSubtitles || false,
    
    // Advanced Encoding
    threads: preset?.settings?.threads || '0',
    twoPass: preset?.settings?.twoPass || false,
    customArgs: preset?.settings?.customArgs || '',
    // HLS
    hlsSegmentTime: preset?.settings?.hlsSegmentTime || 6,
  });

  const steps = [
    {
      id: 'basic',
      title: 'Basic Info',
      description: 'Name, category, and description',
    },
    {
      id: 'video-basic',
      title: 'Video Settings',
      description: 'Codec, quality, and hardware acceleration',
    },
    {
      id: 'video-advanced',
      title: 'Advanced Video',
      description: 'Encoding parameters and resolution',
    },
    {
      id: 'audio',
      title: 'Audio Settings',
      description: 'Audio codec and quality',
    },
    {
      id: 'advanced',
      title: 'Advanced Options',
      description: 'Filters, HDR, and metadata',
    },
    {
      id: 'preview',
      title: 'Review & Save',
      description: 'Preview FFmpeg command',
    },
  ];

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateFFmpegCommand = () => {
    const args = [];
    
    // Input
    args.push('-i input.' + (formData.outputFormat || 'mp4'));
    
    // Hardware acceleration
    if (formData.hwAccel && formData.hwAccel !== 'none') {
      args.unshift('-hwaccel', formData.hwAccel);
    }
    
    // Video codec
    if (formData.category !== 'audio') {
      args.push('-c:v', formData.videoCodec);
      
      // CRF or bitrate
      if (formData.crf && !formData.videoBitrate) {
        args.push('-crf', formData.crf);
      }
      if (formData.videoBitrate) {
        args.push('-b:v', formData.videoBitrate);
        if (formData.maxBitrate) args.push('-maxrate', formData.maxBitrate);
        if (formData.bufferSize) args.push('-bufsize', formData.bufferSize);
      }
      
      // Preset
      if (formData.preset) args.push('-preset', formData.preset);
      
      // Profile & Level
      if (formData.profile) args.push('-profile:v', formData.profile);
      if (formData.level) args.push('-level', formData.level);
      if (formData.tune) args.push('-tune', formData.tune);
      
      // Pixel format
      if (formData.pixelFormat) args.push('-pix_fmt', formData.pixelFormat);
      
      // GOP and B-frames
      if (formData.gopSize) args.push('-g', formData.gopSize);
      if (formData.bframes) args.push('-bf', formData.bframes);
      
      // Resolution
      if (formData.resolution) {
        args.push('-s', formData.resolution);
      } else if (formData.width && formData.height) {
        args.push('-s', `${formData.width}x${formData.height}`);
      }
      
      // Frame rate
      if (formData.fps) {
        args.push('-r', formData.fps);
      }
      
      // Color space & HDR
      if (formData.colorSpace) args.push('-colorspace', formData.colorSpace);
      if (formData.colorPrimaries) args.push('-color_primaries', formData.colorPrimaries);
      if (formData.colorTransfer) args.push('-color_trc', formData.colorTransfer);
      if (formData.colorRange) args.push('-color_range', formData.colorRange);
      
      // Video filters
      const vfilters = [];
      if (formData.deinterlace) vfilters.push('yadif');
      if (formData.denoise) vfilters.push(`${formData.denoise}`);
      if (formData.videoFilters) vfilters.push(formData.videoFilters);
      if (vfilters.length > 0) args.push('-vf', vfilters.join(','));
    }
    
    // Audio codec
    if (formData.category !== 'video' || formData.audioCodec !== 'copy') {
      args.push('-c:a', formData.audioCodec);
      
      if (formData.audioBitrate && formData.audioCodec !== 'copy') {
        args.push('-b:a', formData.audioBitrate);
      }
      
      if (formData.audioChannels) args.push('-ac', formData.audioChannels);
      if (formData.audioSampleRate) args.push('-ar', formData.audioSampleRate);
      if (formData.audioQuality) args.push('-q:a', formData.audioQuality);
      if (formData.audioProfile) args.push('-profile:a', formData.audioProfile);
      
      // Audio filters
      if (formData.audioFilters) args.push('-af', formData.audioFilters);
    }
    
    // Subtitles
    if (formData.copySubtitles) args.push('-c:s', 'copy');
    
    // Metadata
    if (!formData.copyMetadata) args.push('-map_metadata', '-1');
    
    // Fast start for MP4
    if (formData.fastStart && (formData.outputFormat === 'mp4' || formData.outputFormat === 'mov')) {
      args.push('-movflags', '+faststart');
    }
    
    // Threads
    if (formData.threads && formData.threads !== '0') {
      args.push('-threads', formData.threads);
    }
    
    // Custom arguments
    if (formData.customArgs) {
      args.push(...formData.customArgs.split(' '));
    }
    
    // Output
    // HLS specific preview args
    if (formData.outputFormat === 'm3u8' || formData.outputFormat === 'hls') {
      const hlsTime = formData.hlsSegmentTime || 6;
      args.push('-f', 'hls');
      args.push('-hls_time', hlsTime);
      args.push('-hls_playlist_type', 'vod');
      args.push('-hls_segment_filename', `${formData.name || 'output'}_%03d.ts`);
    }
    args.push('output.' + formData.outputFormat);
    
    return 'ffmpeg ' + args.join(' ');
  };

  const handleSave = () => {
    const presetData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      settings: { ...formData },
    };
    
    onSave(presetData);
  };

  const handleExport = async () => {
    const presetData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      settings: { ...formData },
      version: '1.0',
      createdAt: new Date().toISOString(),
    };
    
    const fileName = `${formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.slpreset`;
    const jsonString = JSON.stringify(presetData, null, 2);
    
    // Trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Preset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., My Custom H.265 Preset"
                className="input w-full"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Give your preset a descriptive name
              </p>
            </div>

            <div>
              <label className="label">Category *</label>
              <div className="grid grid-cols-3 gap-3">
                {['video', 'audio', 'image'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateFormData('category', cat)}
                    className={`
                      py-3 px-4 rounded-lg border-2 transition-all capitalize
                      ${formData.category === cat
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what this preset is optimized for..."
                rows="3"
                className="input w-full"
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional: Explain the use case for this preset
              </p>
            </div>

            <div>
              <label className="label">Output Format *</label>
              <select
                value={formData.outputFormat}
                onChange={(e) => updateFormData('outputFormat', e.target.value)}
                className="select w-full"
              >
                {formData.category === 'video' && (
                  <>
                    <option value="mp4">MP4 (H.264/H.265)</option>
                    <option value="mkv">MKV (Matroska)</option>
                    <option value="webm">WebM</option>
                    <option value="mov">MOV (QuickTime)</option>
                    <option value="avi">AVI</option>
                    <option value="ts">TS (MPEG Transport Stream)</option>
                    <option value="m3u8">HLS (m3u8)</option>
                  </>
                )}
                {formData.category === 'audio' && (
                  <>
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                    <option value="opus">Opus</option>
                    <option value="flac">FLAC</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG Vorbis</option>
                    <option value="m4a">M4A</option>
                  </>
                )}
                {formData.category === 'image' && (
                  <>
                    <option value="png">PNG</option>
                    <option value="jpg">JPEG</option>
                    <option value="webp">WebP</option>
                    <option value="gif">GIF</option>
                  </>
                )}
              </select>
            </div>
          </div>
        );

      case 'video-basic':
        if (formData.category === 'audio') {
          return (
            <div className="text-center py-12 text-gray-400">
              <p>Video settings are not applicable for audio-only presets.</p>
              <p className="text-sm mt-2">Click Next to continue to audio settings.</p>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Video Codec *</label>
              <select
                value={formData.videoCodec}
                onChange={(e) => updateFormData('videoCodec', e.target.value)}
                className="select w-full"
              >
                <optgroup label="Software Encoders">
                  <option value="libx264">H.264 (libx264)</option>
                  <option value="libx265">H.265/HEVC (libx265)</option>
                  <option value="libvpx">VP8 (libvpx)</option>
                  <option value="libvpx-vp9">VP9 (libvpx-vp9)</option>
                  <option value="libaom-av1">AV1 (libaom)</option>
                  <option value="libsvtav1">AV1 (SVT-AV1)</option>
                  <option value="mpeg4">MPEG-4</option>
                  <option value="mpeg2video">MPEG-2</option>
                </optgroup>
                <optgroup label="Hardware Encoders">
                  <option value="h264_nvenc">H.264 NVENC (NVIDIA)</option>
                  <option value="hevc_nvenc">H.265 NVENC (NVIDIA)</option>
                  <option value="h264_amf">H.264 AMF (AMD)</option>
                  <option value="hevc_amf">H.265 AMF (AMD)</option>
                  <option value="h264_qsv">H.264 QSV (Intel)</option>
                  <option value="hevc_qsv">H.265 QSV (Intel)</option>
                  <option value="h264_videotoolbox">H.264 VideoToolbox (Apple)</option>
                  <option value="hevc_videotoolbox">H.265 VideoToolbox (Apple)</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="copy">Copy (No Re-encode)</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Choose the video compression format
              </p>
            </div>

            <div>
              <label className="label">Hardware Acceleration</label>
              <select
                value={formData.hwAccel}
                onChange={(e) => updateFormData('hwAccel', e.target.value)}
                className="select w-full"
              >
                <option value="none">None (Software)</option>
                <option value="cuda">CUDA (NVIDIA)</option>
                <option value="qsv">Quick Sync (Intel)</option>
                <option value="dxva2">DXVA2 (Windows)</option>
                <option value="d3d11va">D3D11VA (Windows)</option>
                <option value="videotoolbox">VideoToolbox (macOS)</option>
                <option value="vaapi">VAAPI (Linux)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Enable GPU-accelerated decoding
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Quality (CRF)</label>
                <input
                  type="number"
                  value={formData.crf}
                  onChange={(e) => updateFormData('crf', e.target.value)}
                  className="input w-full"
                  min="0"
                  max="51"
                />
                <p className="text-xs text-gray-400 mt-1">
                  0-51: Lower = better (recommended: 18-28)
                </p>
              </div>

              <div>
                <label className="label">Encoding Speed</label>
                <select
                  value={formData.preset}
                  onChange={(e) => updateFormData('preset', e.target.value)}
                  className="select w-full"
                >
                  <option value="ultrafast">Ultra Fast</option>
                  <option value="superfast">Super Fast</option>
                  <option value="veryfast">Very Fast</option>
                  <option value="faster">Faster</option>
                  <option value="fast">Fast</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="slow">Slow</option>
                  <option value="slower">Slower</option>
                  <option value="veryslow">Very Slow</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Speed vs compression efficiency
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Quick Guide</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• <strong>H.264:</strong> Best compatibility, fast encoding</li>
                <li>• <strong>H.265:</strong> Better compression, smaller files</li>
                <li>• <strong>AV1:</strong> Newest codec, excellent compression</li>
                <li>• <strong>CRF 18:</strong> Near-lossless quality</li>
                <li>• <strong>CRF 23:</strong> Good balanced quality</li>
                <li>• <strong>CRF 28:</strong> Smaller files, visible quality loss</li>
              </ul>
            </div>
          </div>
        );

      case 'video-advanced':
        if (formData.category === 'audio') {
          return (
            <div className="text-center py-12 text-gray-400">
              <p>Advanced video settings are not applicable for audio-only presets.</p>
              <p className="text-sm mt-2">Click Next to continue.</p>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            {/* Resolution & Frame Rate */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Resolution & Frame Rate</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Resolution</label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFormData('resolution', val);
                      if (val === 'custom') {
                        updateFormData('width', '');
                        updateFormData('height', '');
                      }
                    }}
                    className="select w-full"
                  >
                    <option value="">Original</option>
                    <option value="3840x2160">4K (3840x2160)</option>
                    <option value="2560x1440">2K (2560x1440)</option>
                    <option value="1920x1080">1080p (1920x1080)</option>
                    <option value="1280x720">720p (1280x720)</option>
                    <option value="854x480">480p (854x480)</option>
                    <option value="640x360">360p (640x360)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {formData.resolution === 'custom' && (
                  <>
                    <div>
                      <label className="label">Width</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => updateFormData('width', e.target.value)}
                        placeholder="1920"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="label">Height</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateFormData('height', e.target.value)}
                        placeholder="1080"
                        className="input w-full"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label">Frame Rate</label>
                  <select
                    value={formData.fps}
                    onChange={(e) => updateFormData('fps', e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Original</option>
                    <option value="24">24 fps (Film)</option>
                    <option value="25">25 fps (PAL)</option>
                    <option value="30">30 fps</option>
                    <option value="50">50 fps</option>
                    <option value="60">60 fps</option>
                    <option value="120">120 fps</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bitrate Control */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Bitrate Control (Optional)</h3>
              <p className="text-xs text-gray-400 mb-3">
                Leave empty to use CRF. Use bitrate for precise file size control.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Target Bitrate</label>
                  <input
                    type="text"
                    value={formData.videoBitrate}
                    onChange={(e) => updateFormData('videoBitrate', e.target.value)}
                    placeholder="e.g., 5M, 2500k"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Max Bitrate</label>
                  <input
                    type="text"
                    value={formData.maxBitrate}
                    onChange={(e) => updateFormData('maxBitrate', e.target.value)}
                    placeholder="e.g., 8M"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Buffer Size</label>
                  <input
                    type="text"
                    value={formData.bufferSize}
                    onChange={(e) => updateFormData('bufferSize', e.target.value)}
                    placeholder="e.g., 10M"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Codec Settings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Codec-Specific Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Profile</label>
                  <select
                    value={formData.profile}
                    onChange={(e) => updateFormData('profile', e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Auto</option>
                    <option value="baseline">Baseline</option>
                    <option value="main">Main</option>
                    <option value="high">High</option>
                    <option value="high10">High 10</option>
                    <option value="high422">High 4:2:2</option>
                    <option value="high444">High 4:4:4</option>
                  </select>
                </div>

                <div>
                  <label className="label">Level</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => updateFormData('level', e.target.value)}
                    placeholder="e.g., 4.0, 5.1"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="label">Tune</label>
                  <select
                    value={formData.tune}
                    onChange={(e) => updateFormData('tune', e.target.value)}
                    className="select w-full"
                  >
                    <option value="">None</option>
                    <option value="film">Film</option>
                    <option value="animation">Animation</option>
                    <option value="grain">Grain</option>
                    <option value="stillimage">Still Image</option>
                    <option value="fastdecode">Fast Decode</option>
                    <option value="zerolatency">Zero Latency</option>
                  </select>
                </div>

                <div>
                  <label className="label">Pixel Format</label>
                  <select
                    value={formData.pixelFormat}
                    onChange={(e) => updateFormData('pixelFormat', e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Auto</option>
                    <option value="yuv420p">YUV 4:2:0 (8-bit)</option>
                    <option value="yuv420p10le">YUV 4:2:0 (10-bit)</option>
                    <option value="yuv422p">YUV 4:2:2</option>
                    <option value="yuv444p">YUV 4:4:4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GOP & B-frames */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">GOP Structure</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">GOP Size</label>
                  <input
                    type="number"
                    value={formData.gopSize}
                    onChange={(e) => updateFormData('gopSize', e.target.value)}
                    placeholder="e.g., 250"
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Keyframe interval (frames)
                  </p>
                </div>

                <div>
                  <label className="label">B-Frames</label>
                  <input
                    type="number"
                    value={formData.bframes}
                    onChange={(e) => updateFormData('bframes', e.target.value)}
                    placeholder="e.g., 3"
                    className="input w-full"
                    min="0"
                    max="16"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max consecutive B-frames
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            {/* Basic Audio Settings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Basic Audio</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Audio Codec *</label>
                  <select
                    value={formData.audioCodec}
                    onChange={(e) => updateFormData('audioCodec', e.target.value)}
                    className="select w-full"
                  >
                    <optgroup label="Lossy">
                      <option value="aac">AAC</option>
                      <option value="libmp3lame">MP3</option>
                      <option value="libopus">Opus</option>
                      <option value="libvorbis">Vorbis</option>
                      <option value="ac3">AC3 (Dolby Digital)</option>
                      <option value="eac3">E-AC3 (Dolby Digital Plus)</option>
                    </optgroup>
                    <optgroup label="Lossless">
                      <option value="flac">FLAC</option>
                      <option value="alac">ALAC (Apple Lossless)</option>
                      <option value="pcm_s16le">PCM (WAV)</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="copy">Copy (No Re-encode)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="label">Bitrate</label>
                  <select
                    value={formData.audioBitrate}
                    onChange={(e) => updateFormData('audioBitrate', e.target.value)}
                    className="select w-full"
                    disabled={formData.audioCodec === 'flac' || formData.audioCodec === 'copy'}
                  >
                    <option value="64k">64 kbps (Voice)</option>
                    <option value="96k">96 kbps</option>
                    <option value="128k">128 kbps (Standard)</option>
                    <option value="192k">192 kbps (High)</option>
                    <option value="256k">256 kbps (Very High)</option>
                    <option value="320k">320 kbps (Maximum)</option>
                    <option value="448k">448 kbps (Surround)</option>
                    <option value="640k">640 kbps (Multi-channel)</option>
                  </select>
                </div>

                <div>
                  <label className="label">Channels</label>
                  <select
                    value={formData.audioChannels}
                    onChange={(e) => updateFormData('audioChannels', e.target.value)}
                    className="select w-full"
                  >
                    <option value="1">Mono (1.0)</option>
                    <option value="2">Stereo (2.0)</option>
                    <option value="6">5.1 Surround</option>
                    <option value="8">7.1 Surround</option>
                  </select>
                </div>

                <div>
                  <label className="label">Sample Rate</label>
                  <select
                    value={formData.audioSampleRate}
                    onChange={(e) => updateFormData('audioSampleRate', e.target.value)}
                    className="select w-full"
                  >
                    <option value="22050">22.05 kHz</option>
                    <option value="44100">44.1 kHz (CD Quality)</option>
                    <option value="48000">48 kHz (Standard)</option>
                    <option value="96000">96 kHz (High-Res)</option>
                    <option value="192000">192 kHz (Ultra High-Res)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Audio */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Advanced Audio</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Quality (VBR)</label>
                  <input
                    type="number"
                    value={formData.audioQuality}
                    onChange={(e) => updateFormData('audioQuality', e.target.value)}
                    placeholder="0-9 (codec specific)"
                    className="input w-full"
                    min="0"
                    max="9"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Variable bitrate quality (if supported)
                  </p>
                </div>

                <div>
                  <label className="label">Profile</label>
                  <select
                    value={formData.audioProfile}
                    onChange={(e) => updateFormData('audioProfile', e.target.value)}
                    className="select w-full"
                  >
                    <option value="">Auto</option>
                    <option value="aac_low">AAC-LC (Low Complexity)</option>
                    <option value="aac_he">HE-AAC</option>
                    <option value="aac_he_v2">HE-AAC v2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Audio Filters */}
            <div>
              <label className="label">Audio Filters</label>
              <input
                type="text"
                value={formData.audioFilters}
                onChange={(e) => updateFormData('audioFilters', e.target.value)}
                placeholder="e.g., volume=1.5, highpass=f=200"
                className="input w-full"
              />
              <p className="text-xs text-gray-400 mt-1">
                FFmpeg audio filter chain (comma-separated)
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Audio Tips</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• <strong>Opus:</strong> Best quality-to-size ratio</li>
                <li>• <strong>AAC:</strong> Excellent compatibility</li>
                <li>• <strong>FLAC:</strong> Lossless, perfect archiving</li>
                <li>• <strong>192kbps:</strong> Transparent for most content</li>
              </ul>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            {/* HDR & Color */}
            {formData.category !== 'audio' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">HDR & Color Space</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Color Space</label>
                    <select
                      value={formData.colorSpace}
                      onChange={(e) => updateFormData('colorSpace', e.target.value)}
                      className="select w-full"
                    >
                      <option value="">Auto</option>
                      <option value="bt709">BT.709 (SDR)</option>
                      <option value="bt2020nc">BT.2020 (HDR)</option>
                      <option value="bt2020c">BT.2020 Constant</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Color Primaries</label>
                    <select
                      value={formData.colorPrimaries}
                      onChange={(e) => updateFormData('colorPrimaries', e.target.value)}
                      className="select w-full"
                    >
                      <option value="">Auto</option>
                      <option value="bt709">BT.709</option>
                      <option value="bt2020">BT.2020</option>
                      <option value="smpte170m">SMPTE 170M</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Transfer Characteristics</label>
                    <select
                      value={formData.colorTransfer}
                      onChange={(e) => updateFormData('colorTransfer', e.target.value)}
                      className="select w-full"
                    >
                      <option value="">Auto</option>
                      <option value="bt709">BT.709 (SDR)</option>
                      <option value="smpte2084">SMPTE 2084 (PQ/HDR10)</option>
                      <option value="arib-std-b67">HLG (Hybrid Log-Gamma)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Color Range</label>
                    <select
                      value={formData.colorRange}
                      onChange={(e) => updateFormData('colorRange', e.target.value)}
                      className="select w-full"
                    >
                      <option value="">Auto</option>
                      <option value="tv">Limited (TV/16-235)</option>
                      <option value="pc">Full (PC/0-255)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Video Filters */}
            {formData.category !== 'audio' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Video Filters</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="deinterlace"
                      checked={formData.deinterlace}
                      onChange={(e) => updateFormData('deinterlace', e.target.checked)}
                      className="checkbox"
                    />
                    <label htmlFor="deinterlace" className="text-sm text-gray-300">
                      Deinterlace (yadif)
                    </label>
                  </div>

                  <div>
                    <label className="label">Denoise</label>
                    <select
                      value={formData.denoise}
                      onChange={(e) => updateFormData('denoise', e.target.value)}
                      className="select w-full"
                    >
                      <option value="">None</option>
                      <option value="hqdn3d">HQDN3D (High Quality)</option>
                      <option value="nlmeans">NLMeans (Very High Quality)</option>
                      <option value="removegrain">Remove Grain</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Custom Video Filters</label>
                    <input
                      type="text"
                      value={formData.videoFilters}
                      onChange={(e) => updateFormData('videoFilters', e.target.value)}
                      placeholder="e.g., eq=brightness=0.1:contrast=1.2"
                      className="input w-full"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      FFmpeg video filter chain (comma-separated)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subtitles */}
            {formData.category !== 'audio' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Subtitles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="copySubtitles"
                      checked={formData.copySubtitles}
                      onChange={(e) => updateFormData('copySubtitles', e.target.checked)}
                      className="checkbox"
                    />
                    <label htmlFor="copySubtitles" className="text-sm text-gray-300">
                      Copy subtitle streams
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="burnSubtitles"
                      checked={formData.burnSubtitles}
                      onChange={(e) => updateFormData('burnSubtitles', e.target.checked)}
                      className="checkbox"
                    />
                    <label htmlFor="burnSubtitles" className="text-sm text-gray-300">
                      Burn subtitles into video (hardcode)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata & Container */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Metadata & Container</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="copyMetadata"
                    checked={formData.copyMetadata}
                    onChange={(e) => updateFormData('copyMetadata', e.target.checked)}
                    className="checkbox"
                  />
                  <label htmlFor="copyMetadata" className="text-sm text-gray-300">
                    Copy metadata from source
                  </label>
                </div>

                {(formData.outputFormat === 'mp4' || formData.outputFormat === 'mov') && (
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="fastStart"
                      checked={formData.fastStart}
                      onChange={(e) => updateFormData('fastStart', e.target.checked)}
                      className="checkbox"
                    />
                    <label htmlFor="fastStart" className="text-sm text-gray-300">
                      Enable fast start (web streaming)
                    </label>
                  </div>
                )}

                {formData.outputFormat === 'm3u8' && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="hlsSegmentTime" className="text-sm text-gray-300">HLS Segment Time (seconds)</label>
                    <input
                      id="hlsSegmentTime"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.hlsSegmentTime}
                      onChange={(e) => updateFormData('hlsSegmentTime', e.target.value)}
                      className="input w-24"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Threads</label>
                  <input
                    type="number"
                    value={formData.threads}
                    onChange={(e) => updateFormData('threads', e.target.value)}
                    placeholder="0 = auto"
                    className="input w-full"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    CPU threads (0 = automatic)
                  </p>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="twoPass"
                    checked={formData.twoPass}
                    onChange={(e) => updateFormData('twoPass', e.target.checked)}
                    className="checkbox"
                  />
                  <label htmlFor="twoPass" className="text-sm text-gray-300 ml-3">
                    Two-pass encoding (better quality)
                  </label>
                </div>
              </div>
            </div>

            {/* Custom Arguments */}
            <div>
              <label className="label">Custom FFmpeg Arguments</label>
              <input
                type="text"
                value={formData.customArgs}
                onChange={(e) => updateFormData('customArgs', e.target.value)}
                placeholder="e.g., -tag:v hvc1"
                className="input w-full font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Additional FFmpeg arguments (advanced users only)
              </p>
            </div>
          </div>
        );

      case 'preview':
        const ffmpegCommand = generateFFmpegCommand();
        
        return (
          <div className="space-y-6">
            <div className="bg-surface-elevated border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Preset Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-gray-200 font-medium">{formData.name || 'Untitled'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <p className="text-gray-200 font-medium capitalize">{formData.category}</p>
                </div>
                <div>
                  <span className="text-gray-400">Output Format:</span>
                  <p className="text-gray-200 font-medium uppercase">{formData.outputFormat}</p>
                </div>
                <div>
                  <span className="text-gray-400">Video Codec:</span>
                  <p className="text-gray-200 font-medium">{formData.videoCodec || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Audio Codec:</span>
                  <p className="text-gray-200 font-medium">{formData.audioCodec || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Quality:</span>
                  <p className="text-gray-200 font-medium">
                    {formData.crf ? `CRF ${formData.crf}` : formData.videoBitrate || 'Default'}
                  </p>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-gray-300 text-sm mt-1">{formData.description}</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label flex items-center space-x-2">
                  <CodeIcon />
                  <span>Generated FFmpeg Command</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(ffmpegCommand)}
                  className="text-xs text-primary-400 hover:text-primary-300"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                <code className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                  {ffmpegCommand}
                </code>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                This command will be used for encoding with this preset
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Before Saving</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Review all settings carefully</li>
                <li>• Test the preset on a sample file first</li>
                <li>• Export to .slpreset to share with others</li>
                <li>• Some settings may require specific FFmpeg builds</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`
        ${settings.theme === 'dark' ? 'bg-surface' : 'bg-white'}
        rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              {preset ? 'Edit Preset' : 'Create Custom Preset'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {index < currentStep ? <CheckIcon /> : index + 1}
                  </div>
                  <span className="text-xs text-gray-400 mt-2 text-center max-w-[80px]">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2
                    ${index < currentStep ? 'bg-green-500' : 'bg-gray-700'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep === steps.length - 1 && (
              <>
                <button
                  type="button"
                  onClick={handleExport}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={!formData.name}
                >
                  <SaveIcon />
                  <span>Export .slpreset</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                  disabled={!formData.name}
                >
                  <CheckIcon />
                  <span>{preset ? 'Update' : 'Save'} Preset</span>
                </button>
              </>
            )}
            
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRightIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresetWizard;
